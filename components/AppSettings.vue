<script setup lang="ts">
import { useModal } from "tailvue";

import { ChatDriver, type Settings } from "~/types/Settings";
import PopupModal from "~/components/Page/PopupModal.vue";
import PromptEditComponent from "~/components/Dialog/PromptEditComponent.vue";
import { useSettingsStore } from "~/stores/settings";

const modal = useModal();

const settingsStore = useSettingsStore();
const { reset } = settingsStore;
const settings: ComputedRef<Settings> = computed(
  () => settingsStore.getSettings,
);

const el: Ref<null | HTMLDivElement> = ref(null);
const isSettingsPopupVisible: Ref<boolean> = ref(false);

const toggleSettingsPopup = () => {
  isSettingsPopupVisible.value = !isSettingsPopupVisible.value;
};

const closeSettings = (event: Event) => {
  if (el.value?.contains(event.target as Node)) {
    return;
  }

  isSettingsPopupVisible.value = false;
};

const resetSettings = (): void => {
  modal.show({
    type: "danger",
    title: "Are you sure to reset settings to default?",
    primary: {
      label: "Yes",
      theme: "green",
      action: () => {
        reset();
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};

const isAdvancedMode: ComputedRef<boolean> = computed(
  () => settings.value.advanced.enabled,
);

onMounted(() => {
  document.addEventListener("click", closeSettings);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeSettings);
});

const promptPopup: Ref<null | typeof PopupModal> = ref(null);
const togglePromptPopupVisibility = () => {
  if (!promptPopup.value) {
    return;
  }

  promptPopup.value.toggleVisibility();
};
</script>

<template>
  <div ref="el">
    <div class="fixed bottom-0 right-0 m-4">
      <button
        class="bg-gray-200 hover:bg-gray-300 text-red-600 font-bold py-1 px-2 rounded"
        title="Settings"
        @click="toggleSettingsPopup"
      >
        <fa :icon="['fas', 'toolbox']" />
      </button>
    </div>
    <div
      class="fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 border border-gray-200 rounded"
      :class="isSettingsPopupVisible ? 'w-1/5 min-w-[250px]' : 'w-0'"
    >
      <h2 class="p-2">
        <fa :icon="['fas', 'toolbox']" class="text-red-600" />
        Settings

        <button
          v-if="isSettingsPopupVisible"
          class="float-right text-lg text-red-600 font-bold rounded"
          title="Close"
          @click="toggleSettingsPopup"
        >
          <fa :icon="['fas', 'times']" />
        </button>
      </h2>
      <hr class="border-1 border-pink-500" />

      <div class="flex">
        <div class="flex-1">
          <div class="flex p-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model.lazy="settings.advanced.enabled"
                type="checkbox"
                class="sr-only peer"
                :checked="isAdvancedMode"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300"
                >Advanced Mode</span
              >
            </label>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex p-2 float-right">
            <button
              class="text-3xl text-green-600 rounded text-center mr-1"
              title="Reset to Default"
              @click="resetSettings"
            >
              <fa :icon="['fas', 'delete-left']" />
            </button>
          </div>
        </div>
      </div>
      <hr class="border-1 border-pink-500" />

      <div class="overflow-y-auto h-full scroll-smooth">
        <div class="flex flex-col">
          <h3 class="px-2">Recorder</h3>
          <div class="px-2">
            <div class="flex flex-col my-2">
              <label class="text-sm text-gray-500" for="recorder-min-duration"
                >Min. duration</label
              >
              <input
                id="recorder-min-duration"
                v-model.lazy="settings.recorder.minDuration"
                type="number"
                min="1"
                max="995"
                class="border border-gray-300 rounded p-1 text-sm"
              />
            </div>

            <div class="flex flex-col my-2">
              <label class="text-sm text-gray-500" for="recorder-max-duration"
                >Max. duration</label
              >
              <input
                id="recorder-max-duration"
                v-model.lazy="settings.recorder.maxDuration"
                type="number"
                min="5"
                max="999"
                class="border border-gray-300 rounded p-1 text-sm"
              />
            </div>

            <div class="flex flex-col my-2">
              <label
                class="text-sm text-gray-500"
                for="recorder-audio-mime-type"
                >Mime Type</label
              >
              <select
                id="recorder-audio-mime-type"
                v-model.lazy="settings.recorder.audioParams.mimeType"
                class="border border-gray-300 rounded p-1 text-sm bg-white disabled:bg-gray-300"
                :disabled="!isAdvancedMode"
              >
                <option value="audio/webm">audio/webm</option>
                <option value="audio/wav">audio/wav</option>
                <option value="audio/mp3">audio/mp3</option>
                <option value="audio/ogg">audio/ogg</option>
              </select>
            </div>

            <div class="flex flex-col my-2">
              <label class="text-sm text-gray-500" for="recorder-audio-prefix"
                >Filename Prefix</label
              >
              <input
                id="recorder-audio-prefix"
                v-model.lazy="settings.recorder.audioParams.prefix"
                type="text"
                :disabled="!isAdvancedMode"
                class="border border-gray-300 rounded p-1 text-sm disabled:bg-gray-300"
              />
              <span class="text-xs text-gray-500 mt-2">
                <ul class="list-none">
                  <li><strong>/</strong> - directory separator</li>
                  <li><strong>%date%</strong> - current date string 'Y-m-d'</li>
                  <li><strong>%dialog_uid%</strong> - active dialog uid</li>
                  <li>
                    <strong>%message_uid%</strong> - related to message uid
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>

        <hr class="mb-2 border-1 border-pink-500" />
        <div class="flex flex-col">
          <h3 class="px-2">Chat</h3>
          <div class="px-2">
            <div class="flex flex-col my-2">
              <label class="text-sm text-gray-500" for="chat-driver"
                >Chat Driver</label
              >
              <select
                id="chat-driver"
                v-model.lazy="settings.chat.driver"
                class="border border-gray-300 rounded p-1 text-sm bg-white disabled:bg-gray-300"
                :disabled="!isAdvancedMode"
              >
                <option :value="ChatDriver.Dummy">
                  {{ ChatDriver.Dummy }}
                </option>
                <option :value="ChatDriver.OpenAI">
                  {{ ChatDriver.OpenAI }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <hr class="mb-2 border-1 border-pink-500" />
        <div class="flex flex-col items-center justify-center">
          <PopupModal ref="promptPopup" title="Prompt List" width="max-w-7xl">
            <template #button>
              <div class="w-full">
                <button
                  class="bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 border-b-4 border-blue-500 hover:border-blue-400 rounded text-sm"
                  @click="togglePromptPopupVisibility"
                >
                  Edit prompts
                </button>
              </div>
            </template>

            <template #content>
              <PromptEditComponent />
            </template>
          </PopupModal>
        </div>
      </div>

      <div v-if="isSettingsPopupVisible" class="fixed bottom-0 right-0 m-4">
        <button
          class="bg-gray-200 hover:bg-gray-300 text-red-600 font-bold py-1 px-2 rounded"
          title="Close"
          @click="toggleSettingsPopup"
        >
          <fa :icon="['fas', 'times']" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
