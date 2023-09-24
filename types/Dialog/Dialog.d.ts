import { Message } from "~/types/Dialog/Message.d";

export interface Dialog {
  uid: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}
