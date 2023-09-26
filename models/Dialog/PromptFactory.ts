import { v4 as uuidv4 } from "uuid";

import { Prompt, PromptCategory, PrompType } from "~/types/Dialog/Prompt.d";

export default class PromptFactory {
  static create(
    prompt: string,
    type: PrompType,
    category?: PromptCategory,
  ): Prompt {
    return {
      id: uuidv4(),
      prompt,
      type,
      isCustom: false,
      category,
    } as Prompt;
  }

  static createCustom(
    prompt: string,
    type: PrompType,
    category?: PromptCategory,
  ): Prompt {
    const promptObject = PromptFactory.create(prompt, type, category);
    promptObject.isCustom = true;

    return promptObject;
  }
}

export class PromptCategoryFactory {
  static create(name: string, prompt: string): PromptCategory {
    return {
      id: uuidv4(),
      name,
      prompt,
    } as PromptCategory;
  }
}
