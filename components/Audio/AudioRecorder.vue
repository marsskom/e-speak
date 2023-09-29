<script setup lang="ts">
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { useToast } from "tailvue";
import { Transcription } from "openai/resources/audio";

import { useAudioRecorderStore } from "~/stores/Audio/recorder";
import { useDialogListStore } from "~/stores/Dialog/dialogList";

import { Settings } from "~/types/Settings.d";
import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { AudioRecorderState } from "~/types/Audio/AudioRecorder.d";
import AudioFileFactory from "~/models/Audio/AudioFileFactory";
import AudioRecorder from "~/models/Audio/AudioRecorder";
import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message } from "~/types/Dialog/Message.d";
import MessageFactory from "~/models/Dialog/MessageFactory";

import { useDialogStore } from "~/stores/Dialog/dialog";
const dialogStore = useDialogStore();
const currentDialog: ComputedRef<Dialog> = computed(() => {
  return dialogStore.currentDialog;
});
const currentMessageInProgress: ComputedRef<Message> = computed(() => {
  return dialogStore.currentMessageInProgress;
});
const { addMessage } = dialogStore;

const toast = useToast();

const settings: Settings = useGetSettings();

const dialogListStore = useDialogListStore();
const { refresh: refreshDialogList } = dialogListStore;

const audioRecorderStore = useAudioRecorderStore();
const isRecording = computed(() => audioRecorderStore.isRecording);
const canBeActivated = computed(() => audioRecorderStore.canBeActivated);
const {
  setState,
  activate: activateRecorder,
  deactivate: deactivateRecorder,
} = audioRecorderStore;
const recorder: AudioRecorder = new AudioRecorder();
const seconds = ref(0);

let timeoutId: ReturnType<typeof setTimeout>;

const setIdleState = () => {
  setState(AudioRecorderState.Idle);
  clearTimeout(timeoutId);
  seconds.value = 0;
};

const calcSeconds = () => {
  ++seconds.value;

  timeoutId = setTimeout(() => {
    calcSeconds();
  }, 1000);
};

const startRecording = () => {
  if (isRecording.value) {
    recorder
      .stop()
      .then((audioAsBlob: void | Blob) => {
        if (seconds.value < settings.recorder.minDuration) {
          setIdleState();

          throw new Error(
            `The recording must be at least ${settings.recorder.minDuration} seconds long.`,
          );
        }

        if (seconds.value > settings.recorder.maxDuration) {
          setIdleState();

          throw new Error(
            `The recording must be at most ${settings.recorder.maxDuration} seconds long.`,
          );
        }

        return audioAsBlob;
      })
      .then(storeAudio)
      .catch((error: Error) => {
        switch (error.name) {
          case "InvalidStateError":
            toast.danger("An InvalidStateError has occured.");
            break;
          default:
            toast.danger(error.message);
        }

        activateRecorder();
      });

    return;
  }

  recorder
    .start()
    .then(() => {
      setState(AudioRecorderState.Recording);
      calcSeconds();
    })
    .catch((error: Error) => {
      if (
        error.message.includes(
          "mediaDevices API or getUserMedia method is not supported in this browser.",
        )
      ) {
        toast.danger("To record audio, use browsers like Chrome and Firefox.");
      }

      toast.danger(recorder.getErrorMessage(error));

      setIdleState();
      activateRecorder();
    });
};

const storeAudio = (audioAsBlob: void | Blob): void => {
  setIdleState();

  if (!audioAsBlob) {
    return;
  }

  deactivateRecorder();

  const audioFactory: ComputedRef<AudioFileFactory> = computed(
    () =>
      new AudioFileFactory(
        settings.recorder.audioParams,
        currentDialog.value.uid,
        currentMessageInProgress.value.uid,
      ),
  );
  const audio: File = audioFactory.value.createAudioFile(audioAsBlob);

  const user = useGetUser();
  const storage = useFirebaseStorage();
  const fileFullPath = `user/${user.uid}/audio/${audio.name}`;
  const audioFileRef = storageRef(storage, fileFullPath);
  const { upload } = useStorageFile(audioFileRef);
  const messageFactory: MessageFactory = new MessageFactory();
  let audioTranscriptionRequestData: AudioTranscriptionRequest;

  upload(audio)
    .then(async () => {
      audioTranscriptionRequestData = {
        filename: fileFullPath,
        fileBase64: await audioFactory.value.audioToBase64(audio),
      } as AudioTranscriptionRequest;

      return fetch("/api/transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...useHeaders(),
        },
        body: JSON.stringify(audioTranscriptionRequestData),
      });
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("An error occured while fetching the transcription.");
      }

      return await response.json();
    })
    .then((transcription: Transcription): void => {
      addMessage(
        messageFactory.fillWithTranscription(
          audioTranscriptionRequestData,
          transcription,
          currentMessageInProgress.value,
        ),
      );
    })
    .then((): void => {
      refreshDialogList();
    })
    .catch((error: Error) => {
      toast.danger(error.message);

      activateRecorder();
    });
};

const stopRecording = () => {
  recorder.cancel();
  setIdleState();
};

const getTime = (varSeconds: number) => {
  return {
    minutes: Math.floor(varSeconds / 60)
      .toString()
      .padStart(2, "0"),
    seconds: (varSeconds % 60).toString().padStart(2, "0"),
  };
};

const secondsLabel = computed(() => {
  const time = getTime(settings.recorder.maxDuration - seconds.value);
  return `${time.minutes}:${time.seconds} left`;
});

const secondsAcceptLabel = computed(() => {
  const time = getTime(seconds.value);
  return `Recorded ${time.minutes}:${time.seconds}`;
});

watch(seconds, (seconds) => {
  if (seconds >= settings.recorder.maxDuration) {
    startRecording();
  }
});
</script>

<template>
  <LoadingMask :is-visible="!canBeActivated">
    <div class="w-full flex items-center justify-center px-2 py-2">
      <div class="relative mx-2 my-2 px-4 py-4 w-1/4">
        <div class="w-full items-center justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-full"
            :class="{ 'animate-pulse': isRecording }"
            :title="isRecording ? 'Accept recording' : 'Start recording'"
            @click="startRecording"
          >
            <fa
              :icon="['fas', 'fa-microphone-alt']"
              size="2x"
              class="px-2 py-2"
            />
          </button>
          <button
            v-if="isRecording"
            class="bg-red-500 hover:bg-red-600 px-3 py-2 text-white font-bold absolute top-2 right-2 rounded-lg"
            title="Stop recording"
            @click="stopRecording"
          >
            <fa :icon="['fas', 'fa-stop']" size="lg" />
          </button>
        </div>
        <div class="mt-1 text-center h-[20px]">
          <span v-show="seconds > 0" class="text-xs text-green-500">
            {{ isRecording ? secondsLabel : secondsAcceptLabel }}
          </span>
        </div>
      </div>
    </div>
  </LoadingMask>
</template>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 99, 71, 0.7);
  }

  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(255, 99, 71, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 99, 71, 0);
  }
}

.animate-pulse {
  animation: pulse 1s infinite;
}
</style>
