<script setup lang="ts">
import { type Settings } from "~/types/Settings";

import { useLoadingMaskStore } from "~/stores/loading-mask";
import AudioRecorderViewModel from "~/viewmodels/Audio/AudioRecorderViewModel";
import AudioUploaderViewModel from "~/viewmodels/Audio/AudioUploaderViewModel";

const { setVisibility: setMaskVisibility } = useLoadingMaskStore();

const { $toast } = useNuxtApp();

const settings: Settings = useGetSettings();

const audioRecorderViewModel: AudioRecorderViewModel =
  new AudioRecorderViewModel();
const audioUploaderViewModel: AudioUploaderViewModel =
  new AudioUploaderViewModel();

const toggleRecording = (): void => {
  if (audioRecorderViewModel.isRecording.value) {
    audioRecorderViewModel
      .stopRecording()
      .then((audioAsBlob: Blob) => audioUploaderViewModel.upload(audioAsBlob))
      .catch((error: Error) => $toast.danger(error.message));

    return;
  }

  audioRecorderViewModel
    .startRecording()
    .catch((error: Error) => $toast.danger(error.message));
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
  const time = getTime(
    settings.recorder.maxDuration - audioRecorderViewModel.getSeconds.value,
  );
  return `${time.minutes}:${time.seconds} left`;
});

const secondsAcceptLabel = computed(() => {
  const time = getTime(audioRecorderViewModel.getSeconds.value);
  return `Recorded ${time.minutes}:${time.seconds}`;
});

watch(audioRecorderViewModel.getSeconds, (seconds) => {
  if (seconds >= settings.recorder.maxDuration) {
    audioRecorderViewModel.stopRecording();
  }
});

watch(audioRecorderViewModel.canBeActivated, (canBeActivated) => {
  setMaskVisibility("audio-recorder-mask", !canBeActivated);
});
</script>

<template>
  <LoadingMask
    id="audio-recorder-mask"
    :is-visible="!audioRecorderViewModel.canBeActivated"
  >
    <div class="w-full flex items-center justify-center px-2 py-2">
      <div class="relative mx-2 my-2 px-4 py-4 w-1/4">
        <div class="w-full items-center justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-full"
            :class="{
              'animate-pulse': audioRecorderViewModel.isRecording.value,
            }"
            :title="
              audioRecorderViewModel.isRecording
                ? 'Accept recording'
                : 'Start recording'
            "
            @click="toggleRecording"
          >
            <fa
              :icon="['fas', 'fa-microphone-alt']"
              size="2x"
              class="px-2 py-2"
            />
          </button>
          <button
            v-if="audioRecorderViewModel.isRecording.value"
            class="bg-red-500 hover:bg-red-600 px-3 py-2 text-white font-bold absolute top-2 right-2 rounded-lg"
            title="Stop recording"
            @click="audioRecorderViewModel.cancelRecording"
          >
            <fa :icon="['fas', 'fa-stop']" size="lg" />
          </button>
        </div>
        <div class="mt-1 text-center h-[20px]">
          <span
            v-show="audioRecorderViewModel.getSeconds.value > 0"
            class="text-xs text-green-500"
          >
            {{
              audioRecorderViewModel.isRecording
                ? secondsLabel
                : secondsAcceptLabel
            }}
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
