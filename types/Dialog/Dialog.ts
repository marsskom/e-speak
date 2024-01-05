import { type Message } from "~/types/Dialog/Message";
import { type Prompt } from "~/types/Dialog/Prompt";

export interface Dialog {
  userUid: string;
  uid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  isSynced: boolean;
  promptList?: Prompt[]; // Overridden general prompts for specific dialog.
}
