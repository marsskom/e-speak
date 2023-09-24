export interface Message {
  uid: string;
  content: string;
  correctedContent: string;
  role: OpenAIRole;
  createdAt: Date;
  updatedAt: Date;
  audioFile?: string;
}

export enum OpenAIRole {
  System = "system",
  Assistant = "assistant",
  User = "user",
}
