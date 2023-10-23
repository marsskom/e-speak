import {
  QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
  type WithFieldValue,
} from "firebase/firestore";

import { type Dialog } from "~/types/Dialog/Dialog";
import { type Message } from "~/types/Dialog/Message";
import { type Prompt } from "~/types/Dialog/Prompt";

export const dialogFirebaseConverter = {
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Dialog => {
    const data = snapshot.data(options);

    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Dialog;
  },
  toFirestore: (dialog: WithFieldValue<Dialog>): object => {
    return {
      ...dialog,
      messages: [], // Remove messages from the dialog object before saving it to Firestore.
      createdAt: Timestamp.fromDate(dialog.createdAt),
      updatedAte: Timestamp.fromDate(dialog.updatedAt),
    };
  },
};

export const messageFirebaseConverter = {
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Message => {
    const data = snapshot.data(options);

    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Message;
  },
  toFirestore: (message: WithFieldValue<Message>): object => {
    if (message.promptList) {
      message.promptList?.map(
        (prompt: Prompt) =>
          (prompt.category = Object.assign({}, prompt.category)),
      );
    }

    return {
      ...message,
      createdAt: Timestamp.fromDate(message.createdAt),
      updatedAte: Timestamp.fromDate(message.updatedAt),
    };
  },
};
