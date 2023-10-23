import { type Message } from "~/types/Dialog/Message";

export interface Dialog {
  userUid: string;
  uid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  isSynced: boolean;
}
