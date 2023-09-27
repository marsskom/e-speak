export declare interface PromptFactory {
  create(prompt: string, type: PrompType, category?: PromptCategory): Prompt;
  createCustom(
    prompt: string,
    type: PrompType,
    category?: PromptCategory,
  ): Prompt;
}

export declare interface PromptCategoryFactory {
  create(name: string, prompt: string): PromptCategory;
}
