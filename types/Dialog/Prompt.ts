export enum PrompType {
  StartDialog = "StartDialog",
  ContinueDialog = "ContinueDialog",
  CorrectMessage = "CorrectMessage",
}

export interface PromptCategory {
  uid: string;
  name: string;
  prompt: string;
}

export interface Prompt {
  uid: string;
  prompt: string;
  type: PrompType;
  isCustom: boolean;
  category?: PromptCategory;
}
