<script setup lang="ts">
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFileUrl } from "vuefire";
import { AudioPlayerState } from "~/types/Audio/AudioPlayer";
import { type Message } from "~/types/Dialog/Message";
import AudioPlayerViewModel from "~/viewmodels/Audio/AudioPlayerViewModel";
import { useLoadingMaskStore } from "~/stores/loading-mask";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const { $toast } = useNuxtApp();

const storage = useFirebaseStorage();
const fileRef = storageRef(storage, props.message.audioFile || "");
const { url: audioFileUrl } = useStorageFileUrl(fileRef);

const hasAudioFile: ComputedRef<boolean> = computed((): boolean => {
  return props.message.audioFile !== undefined;
});
const { setVisibility: setMaskVisibility } = useLoadingMaskStore();

const state: Ref<AudioPlayerState> = ref(AudioPlayerState.Idle);
const audioFileContent: Ref<string> = ref("");

const loadAudioFile = (): void => {
  if (audioFileContent.value) {
    return;
  }

  state.value = AudioPlayerState.Loading;

  new AudioPlayerViewModel(audioFileUrl.value)
    .downloadAudio()
    .then((fileBase64: string) => {
      audioFileContent.value = fileBase64;
      state.value = AudioPlayerState.Loaded;
    })
    .catch((error: Error) => {
      audioFileContent.value = "";
      state.value = AudioPlayerState.Error;
      $toast.danger(error.message);
    });
};

const isAudioValid: ComputedRef<boolean> = computed((): boolean => {
  return (
    audioFileContent.value.length > 0 && state.value !== AudioPlayerState.Error
  );
});

const showLoadButton: ComputedRef<boolean> = computed((): boolean => {
  return (
    state.value !== AudioPlayerState.Error &&
    state.value !== AudioPlayerState.Loaded
  );
});

watch(state, (state) => {
  setMaskVisibility("audio-player-mask", state === AudioPlayerState.Loading);
});
</script>

<template>
  <div v-if="hasAudioFile">
    <LoadingMask
      id="audio-player-mask"
      :is-visible="state === AudioPlayerState.Loading"
    >
      <a v-if="showLoadButton" href="#" @click="loadAudioFile">
        <fa
          :icon="['fas', 'ear-listen']"
          size="sm"
          title="Listen original audio"
          class="text-orange-700"
        />
      </a>

      <fa
        v-if="state === AudioPlayerState.Error"
        :icon="['fas', 'bug']"
        size="sm"
        title="Error Occured"
        class="text-red-700"
      />

      <figure v-if="isAudioValid">
        <audio controls :src="audioFileContent"></audio>
      </figure>
    </LoadingMask>
  </div>
</template>

<style scoped></style>
