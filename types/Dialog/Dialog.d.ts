import { Message } from "~/types/Dialog/Message.d";

export interface Dialog {
  userUid: string;
  uid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  isSynced: boolean;
}
