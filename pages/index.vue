<script setup lang="ts">
import MenuSidebar from "~/components/Layout/MenuSidebar.vue";
import AudioRecorder from "~/components/Audio/AudioRecorder.vue";

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <main id="index-page" class="flex flex-col items-center justify-center">
    <div
      class="flex h-[calc(100vh-64px)] w-full divide-x divide-dashed hover:divide-solid"
    >
      <MenuSidebar />

      <div class="w-3/4 bg-gray-100 flex flex-col">
        <div class="dialog-container flex-1">Diaslog Container</div>
        <div class="flex-none items-end">
          <AudioRecorder />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
