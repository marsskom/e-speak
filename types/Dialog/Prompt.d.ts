export interface Prompt {
  id: string;
  prompt: string;
  type: PrompType;
  isCustom: boolean;
  category?: PromptCategory;
}

export enum PrompType {
  StartDialog = "StartDialog",
  ContinueDialog = "ContinueDialog",
}

export interface PromptCategory {
  id: string;
  name: string;
  prompt: string;
}
