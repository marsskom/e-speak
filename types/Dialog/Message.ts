import { type ChatCompletion } from "openai/resources/chat";
import { type Prompt } from "~/types/Dialog/Prompt";

export enum OpenAIRole {
  System = "system",
  Assistant = "assistant",
  User = "user",
}

export interface Message {
  dialogUid: string;
  uid: string;
  content: string;
  correctedContent: string;
  role: OpenAIRole;
  createdAt: Date;
  updatedAt: Date;
  audioFile?: string;
  chatCompletion?: ChatCompletion;
  promptList?: Prompt[];
  correctedMessageList?: Message[];
}
