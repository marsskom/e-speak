<script setup lang="ts">
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { useToast } from "tailvue";

import { useAudioRecorderStore } from "~/stores/Audio/recorder";

import { AudioRecorderState } from "~/types/Audio/AudioRecorder.d";
import { AudioFileFactory } from "~/models/Audio/AudioFileFactory";
import AudioRecorder from "~/models/Audio/AudioRecorder";

const storage = useFirebaseStorage();
const toast = useToast();

const audioRecorderStore = useAudioRecorderStore();
const isRecording = computed(() => audioRecorderStore.isRecording);
const canBeActivated = computed(() => audioRecorderStore.canBeActivated);
const { setState, activate, deactivate } = audioRecorderStore;
const seconds = ref(0);
const recorder: AudioRecorder = new AudioRecorder();

let timeoutId: ReturnType<typeof setTimeout>;

const calcSeconds = () => {
  seconds.value++;

  timeoutId = setTimeout(() => {
    calcSeconds();
  }, 1000);
};

const startRecording = () => {
  if (isRecording.value) {
    recorder
      .stop()
      .then(storeAudio)
      .catch((error) => {
        switch (error.name) {
          case "InvalidStateError":
            toast.danger("An InvalidStateError has occured.");
            break;
          default:
            toast.danger("An error occured with the error name " + error.name);
        }
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
    });
};

const storeAudio = (audioAsBlob: void | Blob): void => {
  setState(AudioRecorderState.Idle);
  clearTimeout(timeoutId);

  if (!audioAsBlob) {
    return;
  }

  deactivate();

  const audio = AudioFileFactory.createAudioFile(audioAsBlob, "audio/webm");

  const user = useGetUser();
  const mountainFileRef = storageRef(
    storage,
    `user/${user.uid}/audio/${audio.name}`,
  );
  const { upload } = useStorageFile(mountainFileRef);

  upload(audio)
    .then(() => {
      toast.success("Audio uploaded successfully.");
    })
    .catch((error: Error) => {
      toast.danger(error.message);
    })
    .finally(() => {
      activate();
    });
};

const stopRecording = () => {
  recorder.cancel();

  setState(AudioRecorderState.Idle);
  clearTimeout(timeoutId);
  seconds.value = 0;
};

const getTime = computed(() => {
  return {
    minutes: Math.floor(seconds.value / 60)
      .toString()
      .padStart(2, "0"),
    seconds: (seconds.value % 60).toString().padStart(2, "0"),
  };
});

const secondsLabel = computed(() => {
  const time = getTime.value;
  return `Recording for ${time.minutes}:${time.seconds}`;
});

const secondsAcceptLabel = computed(() => {
  const time = getTime.value;
  return `Recorded ${time.minutes}:${time.seconds}`;
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
            @click="stopRecording"
          >
            <fa :icon="['fas', 'fa-stop']" size="lg" />
          </button>
        </div>
        <div class="mt-4 text-center">
          <span v-show="seconds > 0" class="text-green-500">
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
