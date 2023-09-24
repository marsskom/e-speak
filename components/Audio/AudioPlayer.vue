<script setup lang="ts">
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFileUrl } from "vuefire";
import { useToast } from "tailvue";

import {
  AudioDownloadRequest,
  AudioDownloadResponse,
} from "~/types/Api/Request.d";
import { AudioPlayerState } from "~/types/Audio/AudioPlayer.d";
import { Message } from "~/types/Dialog/Message.d";

const toast = useToast();

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const storage = useFirebaseStorage();
const fileRef = storageRef(storage, props.message.audioFile || "");
const { url: audioFileUrl } = useStorageFileUrl(fileRef);

const hasAudioFile: ComputedRef<boolean> = computed((): boolean => {
  return props.message.audioFile !== undefined;
});

const state: Ref<AudioPlayerState> = ref(AudioPlayerState.Idle);
const audioFileContent: Ref<string> = ref("");

const loadAudioFile = (): void => {
  if (audioFileContent.value) {
    return;
  }

  if (!audioFileUrl.value) {
    audioFileContent.value = "";
    state.value = AudioPlayerState.Error;
    toast.danger("No audio file found.");

    return;
  }

  state.value = AudioPlayerState.Loading;

  fetch("/api/download-audio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: audioFileUrl.value,
    } as AudioDownloadRequest),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("An error occured while fetching the transcription.");
      }

      return await response.json();
    })
    .then((result: AudioDownloadResponse) => {
      audioFileContent.value = result.fileBase64;
      state.value = AudioPlayerState.Loaded;
    })
    .catch((error) => {
      state.value = AudioPlayerState.Error;
      toast.danger(error.message);
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
</script>

<template>
  <div v-if="hasAudioFile">
    <LoadingMask :is-visible="state === AudioPlayerState.Loading">
      <a v-if="showLoadButton" href="#" @click="loadAudioFile">
        <fa
          :icon="['fas', 'ear-listen']"
          size="sm"
          title="Listen original audio"
          class="text-orange-700"
        />
      </a>
      <fa
        v-if="state === AudioPlayerState.Loaded"
        :icon="['fas', 'ear-deaf']"
        size="sm"
        title="Audio was loaded"
        class="text-orange-700"
      />

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
