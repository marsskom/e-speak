export interface Prompt {
  uid: string;
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
  uid: string;
  name: string;
  prompt: string;
}
