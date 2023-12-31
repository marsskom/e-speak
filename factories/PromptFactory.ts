import { v4 as uuidv4 } from "uuid";

import {
  type Prompt,
  type PromptCategory,
  PrompType,
} from "~/types/Dialog/Prompt";

export default class PromptFactory {
  public create(
    prompt: string,
    type: PrompType,
    category?: PromptCategory,
  ): Prompt {
    return {
      uid: uuidv4(),
      prompt,
      type,
      isCustom: false,
      category,
    } as Prompt;
  }

  public createCustom(
    prompt: string,
    type: PrompType,
    category?: PromptCategory,
  ): Prompt {
    const promptObject = this.create(prompt, type, category);
    promptObject.isCustom = true;

    return promptObject;
  }
}

export class PromptCategoryFactory {
  public create(name: string, prompt: string): PromptCategory {
    return {
      uid: uuidv4(),
      name,
      prompt,
    } as PromptCategory;
  }
}
