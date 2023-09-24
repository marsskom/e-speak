<script setup lang="ts">
import { Dialog } from "~/types/Dialog/Dialog.d";
import { useDialogStore } from "~/stores/Dialog/dialog";

import MenuSidebar from "~/components/Layout/MenuSidebar.vue";
import DialogMessage from "~/components/Dialog/DialogMessage.vue";
import AudioRecorder from "~/components/Audio/AudioRecorder.vue";

definePageMeta({
  middleware: "auth",
});

const dialogStore = useDialogStore();
const currentDialog: ComputedRef<Dialog> = computed(
  () => dialogStore.currentDialog,
);
</script>

<template>
  <main id="index-page" class="flex flex-col items-center justify-center">
    <div
      class="flex h-[calc(100vh-64px)] w-full divide-x divide-dashed hover:divide-solid"
    >
      <MenuSidebar />

      <div class="w-3/4 bg-gray-100 flex flex-col">
        <div class="dialog-container-top flex-1 items-center justify-center">
          <div class="border-2 border-b-pink-500">
            <h3 class="text-xl font-bold text-gray-800">
              {{ currentDialog.name || "New Dialog" }}
            </h3>
            <span class="text-xs text-gray-500"
              >(Created: {{ currentDialog.createdAt.toISOString() }})</span
            >
          </div>
        </div>

        <div class="dialog-container flex-1 p-4">
          <DialogMessage
            v-for="message in currentDialog.messages"
            :key="message.uid"
            :message="message"
          />
        </div>

        <div class="flex-none items-end">
          <AudioRecorder />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
