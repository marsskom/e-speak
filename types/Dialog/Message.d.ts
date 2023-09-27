import { ChatCompletion } from "openai/resources/chat";
import { Prompt } from "~/types/Dialog/Prompt.d";

export interface Message {
  uid: string;
  content: string;
  correctedContent: string;
  role: OpenAIRole;
  createdAt: Date;
  updatedAt: Date;
  audioFile?: string;
  chatCompletion?: ChatCompletion;
  promptList?: Prompt[];
}

export enum OpenAIRole {
  System = "system",
  Assistant = "assistant",
  User = "user",
}
