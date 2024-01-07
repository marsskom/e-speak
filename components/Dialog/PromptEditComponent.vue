<script setup lang="ts">
import { useModal } from "tailvue";

import { type Prompt, PrompType } from "~/types/Dialog/Prompt";
import PromptFactory from "~/models/Dialog/PromptFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";

const modal = useModal();

const promptStore = usePromptStore();
const storePromptList: ComputedRef<Prompt[]> = computed(
  () => promptStore.promptList,
);
const promptFactory = new PromptFactory();
const promptList: Ref<Prompt[]> = ref(storePromptList);

const promptTypeList: Ref<string[]> = ref([
  PrompType.StartDialog,
  PrompType.ContinueDialog,
  PrompType.CorrectMessage,
]);

const currentEditPrompt: Ref<Prompt | null> = ref(null);
const isNewMessage: Ref<boolean> = ref(false);

const onAddPrompt = (): void => {
  if (currentEditPrompt.value !== null) {
    return;
  }

  isNewMessage.value = true;
  currentEditPrompt.value = promptFactory.createCustom(
    "",
    PrompType.ContinueDialog,
  );
};

const onEditPrompt = (index: number): void => {
  if (currentEditPrompt.value === null) {
    isNewMessage.value = false;
    currentEditPrompt.value = { ...promptList.value[index] } as Prompt;

    return;
  }

  modal.show({
    type: "danger",
    title: "Please, save or cancel the current edit first",
    primary: {
      label: "Ok",
      theme: "red",
      action: () => null,
    },
  });
};

const onSavePrompt = (): void => {
  if (currentEditPrompt.value === null) {
    return;
  }

  if (!currentEditPrompt.value.prompt.length) {
    modal.show({
      type: "danger",
      title: "Prompt can't be empty",
      primary: {
        label: "Ok",
        theme: "red",
        action: () => null,
      },
    });

    return;
  }

  if (isNewMessage.value) {
    promptList.value.push(currentEditPrompt.value);
    isNewMessage.value = false;
  } else {
    for (const i in promptList.value) {
      if (promptList.value[i].uid === currentEditPrompt.value.uid) {
        promptList.value[i] = currentEditPrompt.value;
      }
    }
  }

  currentEditPrompt.value = null;
};

const onDeletePrompt = (index: number): void => {
  modal.show({
    type: "danger",
    title: "Are you really want to delete the prompt?",
    primary: {
      label: "Yes",
      theme: "red",
      action: () => {
        const deletedPrompt = promptList.value[index];
        if (deletedPrompt.uid === currentEditPrompt.value?.uid) {
          currentEditPrompt.value = null;
        }

        promptList.value.splice(index, 1);
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};

const onCancelEdit = (): void => {
  if (
    currentEditPrompt.value === null ||
    (!currentEditPrompt.value.prompt.length && isNewMessage.value)
  ) {
    currentEditPrompt.value = null;

    return;
  }

  modal.show({
    type: "danger",
    title: "Are you really want to cancel an edit?",
    primary: {
      label: "Yes",
      theme: "red",
      action: () => {
        currentEditPrompt.value = null;
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};
</script>

<template>
  <div class="flex flex-col">
    <table class="table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2 w-[10%]">Type</th>
          <th class="px-4 py-2">Prompt</th>
          <th class="px-4 py-2 w-[10%]">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(prompt, index) in promptList"
          :key="prompt.uid"
          :class="
            null !== currentEditPrompt && currentEditPrompt.uid === prompt.uid
              ? 'bg-gray-100'
              : ''
          "
        >
          <td class="border px-4 py-2">{{ prompt.type }}</td>
          <td class="border px-4 py-2">{{ prompt.prompt }}</td>
          <td class="border px-4 py-2">
            <button
              class="float-right m-2"
              title="Remove"
              @click="onDeletePrompt(index)"
            >
              <fa
                :icon="['fas', 'times']"
                class="w-4 h-4 text-red-600 hover:text-red-800 dark:text-white font-bold text-2xl"
              />
            </button>

            <button
              class="float-right m-2"
              title="Edit"
              @click="onEditPrompt(index)"
            >
              <fa
                :icon="['fas', 'pencil-alt']"
                class="w-4 h-4 text-yellow-600 hover:text-yellow-800 dark:text-white font-bold text-2xl"
              />
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="null !== currentEditPrompt">
        <tr>
          <td class="border px-4 py-2">
            <select
              v-model.lazy="currentEditPrompt.type"
              class="border border-gray-300 rounded p-2 text-sm bg-white disabled:bg-gray-300"
            >
              <option v-for="type in promptTypeList" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </td>
          <td class="border px-4 py-2">
            <textarea
              v-model.lazy="currentEditPrompt.prompt"
              class="border border-gray-300 rounded p-2 text-sm w-full"
              rows="10"
            ></textarea>
          </td>
          <td class="border px-4 py-2">
            <button
              class="float-right m-2"
              title="Cancel"
              @click="onCancelEdit"
            >
              <fa
                :icon="['fas', 'ban']"
                class="w-4 h-4 text-red-600 hover:text-red-800 dark:text-white font-bold text-2xl"
              />
            </button>

            <button class="float-right m-2" title="Save" @click="onSavePrompt">
              <fa
                :icon="['far', 'floppy-disk']"
                class="w-4 h-4 text-green-600 hover:text-green-800 dark:text-white font-bold text-2xl"
              />
            </button>
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="mt-4">
      <button class="float-right mr-4" title="Add prompt" @click="onAddPrompt">
        <fa
          :icon="['fas', 'plus']"
          class="w-4 h-4 text-green-600 hover:text-green-800 dark:text-white font-bold text-2xl"
        />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
