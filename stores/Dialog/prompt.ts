import type { ComputedRef } from "vue";

import { type Prompt, PrompType } from "~/types/Dialog/Prompt";
import { useSettingsStore } from "~/stores/settings";
import PromptFactory from "~/factories/PromptFactory";

export const usePromptStore = defineStore("prompt", () => {
  const settingsStore = useSettingsStore();

  const promptFactory = new PromptFactory();

  const defaultPromptList: ComputedRef<Prompt[]> = computed(() => [
    promptFactory.create(
      "I want you to act like English tutor. I want you to respond and answer like tutor using the tone, manner, and vocabulary C1 level would use. Do not write any explanations. You must know all of the knowledge of English teacher.",
      PrompType.StartDialog,
    ),
    promptFactory.create(
      "Answer like Enligh native speaker with C1 level. Format answer using HTML tags.",
      PrompType.ContinueDialog,
    ),
    promptFactory.create(
      "I want you to act like English tutor. I want you to respond and answer like tutor using the tone, manner, and vocabulary C1 level would use. Do not write any explanations. You must know all of the knowledge of English teacher. Answer like English native speaker with C1 level. Please revise my next message:",
      PrompType.CorrectMessage,
    ),
  ]);

  const promptList: ComputedRef<Prompt[]> = computed(
    () => settingsStore.settings.promptList || defaultPromptList.value,
  );

  const promptsOnDialogStart: ComputedRef<Prompt[]> = computed((): Prompt[] =>
    promptList.value.filter(
      (prompt: Prompt) => prompt.type === PrompType.StartDialog,
    ),
  );
  const promptsOnDialogContinue: ComputedRef<Prompt[]> = computed(
    (): Prompt[] =>
      promptList.value.filter(
        (prompt: Prompt) => prompt.type === PrompType.ContinueDialog,
      ),
  );
  const promptsOnMessageCorrect: ComputedRef<Prompt[]> = computed(
    (): Prompt[] =>
      promptList.value.filter(
        (prompt: Prompt) => prompt.type === PrompType.CorrectMessage,
      ),
  );

  const filter = (
    type: PrompType,
    externalPromptList: Prompt[] = [],
  ): Prompt[] =>
    (externalPromptList || promptList.value).filter(
      (prompt: Prompt) => prompt.type === type,
    );

  return {
    defaultPromptList,
    promptList,
    promptsOnDialogStart,
    promptsOnDialogContinue,
    promptsOnMessageCorrect,

    filter,
  };
});
