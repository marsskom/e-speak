<script setup lang="ts">
import { type Prompt, PrompType } from "~/types/Dialog/Prompt";
import PromptFactory from "~/models/Dialog/PromptFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";

const promptStore = usePromptStore();
const storePromptList: ComputedRef<Prompt[]> = computed(
  () => promptStore.promptList,
);
const promptFactory = new PromptFactory();
const promptList: Ref<Prompt[]> = ref(storePromptList);

const onAddPrompt = (): void => {
  promptList.value.push(promptFactory.create("", PrompType.ContinueDialog));
};

const onDeletePrompt = (index: number): void => {
  promptList.value.splice(index, 1);
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
        <tr v-for="(prompt, index) in promptList" :key="prompt.uid">
          <td class="border px-4 py-2">
            <select
              v-model.lazy="prompt.type"
              class="border border-gray-300 rounded p-2 text-sm bg-white disabled:bg-gray-300"
            >
              <option :value="PrompType.StartDialog">
                {{ PrompType.StartDialog }}
              </option>
              <option :value="PrompType.ContinueDialog">
                {{ PrompType.ContinueDialog }}
              </option>
            </select>
          </td>
          <td class="border px-4 py-2">
            <textarea
              v-model.lazy="prompt.prompt"
              class="border border-gray-300 rounded p-2 text-sm w-full"
            ></textarea>
          </td>
          <td class="border px-4 py-2">
            <button
              class="float-right"
              title="Remove"
              @click="onDeletePrompt(index)"
            >
              <fa
                :icon="['fas', 'times']"
                class="w-4 h-4 text-red-600 hover:text-red-800 dark:text-white font-bold text-2xl"
              />
            </button>
          </td>
        </tr>
      </tbody>
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
