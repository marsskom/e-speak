<script setup lang="ts">
import { useToast } from "tailvue";

import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";
import { EventChange } from "~/types/Form/Text/TextInput.d";

import { useDialogListStore } from "~/stores/Dialog/dialogList";
import { useDialogStore } from "~/stores/Dialog/dialog";

import CopyLink from "~/components/Page/CopyLink.vue";
import MenuSidebar from "~/components/Layout/MenuSidebar.vue";
import DialogMessage from "~/components/Dialog/DialogMessage.vue";
import AudioRecorder from "~/components/Audio/AudioRecorder.vue";
import AppSettings from "~/components/AppSettings.vue";
import EditableTextInput from "~/components/Form/Input/Text/EditableTextInput.vue";

definePageMeta({
  middleware: "auth",
});

const toast = useToast();

const isAdvancedMode: ComputedRef<boolean> = useIsAdvancedMode();

const dialogListStore = useDialogListStore();
const { refresh: refreshDialogList } = dialogListStore;

const dialogStore = useDialogStore();
const { updateDialog } = dialogStore;
const currentDialog: ComputedRef<Dialog> = computed(
  () => dialogStore.currentDialog,
);

useSeoMeta({
  title: () => "E-Speak - " + currentDialog.value.name,
});

const messages: ComputedRef<Message[]> = computed(() => {
  if (isAdvancedMode.value) {
    return dialogStore.currentDialog.messages;
  }

  return dialogStore.currentDialog.messages.filter(
    (message: Message) =>
      message.role === OpenAIRole.User || message.role === OpenAIRole.Assistant,
  );
});

const dialogContainer = ref(null);

watch(
  messages,
  () => {
    if (!dialogContainer.value || !dialogContainer.value.lastElementChild) {
      return;
    }

    dialogContainer.value.lastElementChild.scrollIntoView({
      behavior: "smooth",
    });
  },
  { immediate: true },
);

const isDialogLoading: ComputedRef<boolean> = computed(() =>
  useIsDialogLoading(),
);
onMounted(() => {
  document.getElementById("app-loading")?.classList.remove("hidden");
});
watch(isDialogLoading, (isLoading) => {
  if (isLoading) {
    document.getElementById("app-loading")?.classList.remove("hidden");
  } else {
    document.getElementById("app-loading")?.classList.add("hidden");
  }
});

const onDialogNameChange = (e: EventChange) => {
  if (!e.value.length) {
    toast.danger("Dialog name cannot be empty.");

    return;
  }

  updateDialog(e.value);
  refreshDialogList();
};
</script>

<template>
  <main
    id="index-page"
    class="flex flex-col items-center justify-center h-[calc(100%-64px)]"
  >
    <div
      class="flex relative h-full w-full divide-x divide-dashed hover:divide-solid"
    >
      <MenuSidebar />

      <div class="w-4/5 bg-gray-100 flex flex-col">
        <div
          class="dialog-container-top flex-1 h-auto max-h-16 box-shadow-bottom border-2 border-b-pink-500"
        >
          <div class="p-2 flex justify-between">
            <EditableTextInput
              :text="currentDialog.name"
              @change="onDialogNameChange"
            >
              <div>
                <span class="text-xl font-bold text-gray-800">
                  {{ currentDialog.name }}
                </span>
                <a v-if="currentDialog.isSynced" href="#" title="Synced">
                  <fa
                    :icon="['far', 'square-check']"
                    class="ml-2 w-4 h-4 text-green-600 hover:text-green-900 dark:text-white font-bold"
                  ></fa>
                </a>
                <a v-if="!currentDialog.isSynced" href="#" title="Not Synced">
                  <fa
                    :icon="['far', 'square-minus']"
                    class="ml-2 w-4 h-4 text-yellow-600 hover:text-yellow-900 dark:text-white font-bold"
                  ></fa>
                </a>
              </div>
            </EditableTextInput>

            <span class="text-xs text-gray-500 float-right self-end">
              <ul>
                <li v-if="isAdvancedMode">
                  <strong>UID:</strong>&nbsp;
                  <span class="float-right"
                    >{{ currentDialog.uid }}
                    <CopyLink :content="currentDialog.uid" />
                  </span>
                </li>
                <li>
                  <strong>Created:</strong>&nbsp;<span class="float-right"
                    >{{ currentDialog.createdAt.toISOString() }}
                  </span>
                </li>
                <li v-if="isAdvancedMode">
                  <strong>Updated:</strong>&nbsp;<span class="float-right"
                    >{{ currentDialog.updatedAt.toISOString() }}
                  </span>
                </li>
              </ul>
            </span>
          </div>
        </div>

        <div
          ref="dialogContainer"
          class="dialog-container flex-1 p-4 overflow-y-auto h-full scroll-smooth hover:scroll-auto"
        >
          <DialogMessage
            v-for="message in messages"
            :key="message.uid"
            :message="message"
          />
        </div>

        <div class="flex-none items-end bg-gray-200 box-shadow-top">
          <AudioRecorder />
        </div>
      </div>
    </div>

    <AppSettings />
  </main>
</template>

<style scoped>
.box-shadow-bottom {
  box-shadow: 0px 15px 10px -15px rgba(32, 33, 36, 0.28);
}

.box-shadow-top {
  box-shadow: 0px -15px 10px -15px rgba(32, 33, 36, 0.28);
}
</style>
