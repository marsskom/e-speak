import { Prompt, PrompType } from "~/types/Dialog/Prompt.d";
import PromptFactory from "~/models/Dialog/PromptFactory";

export const usePromptStore = defineStore("prompt", () => {
  const promptFactory = new PromptFactory();

  const promptBank: Ref<Prompt[]> = ref([
    // TODO: move to configurable initial state
    promptFactory.create(
      "I want you to act like English tutor. I want you to respond and answer like tutor using the tone, manner, and vocabulary C1 level would use. Do not write any explanations. You must know all of the knowledge of English teacher.",
      PrompType.StartDialog,
    ),
    promptFactory.create(
      "Answer like Enligh native speaker with C1 level, corrections you may add after answer formatted like a small list. Format answer using HTML tags.",
      PrompType.ContinueDialog,
    ),
  ]);

  const promptsOnDialogStart: ComputedRef<Prompt[]> = computed((): Prompt[] =>
    promptBank.value.filter(
      (prompt: Prompt) => prompt.type === PrompType.StartDialog,
    ),
  );
  const promptsOnDialogContinue: ComputedRef<Prompt[]> = computed(
    (): Prompt[] =>
      promptBank.value.filter(
        (prompt: Prompt) => prompt.type === PrompType.ContinueDialog,
      ),
  );

  return {
    promptBank,

    promptsOnDialogStart,
    promptsOnDialogContinue,
  };
});
