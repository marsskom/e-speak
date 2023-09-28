import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

import { Dialog } from "~/types/Dialog/Dialog";
import { Message } from "~/types/Dialog/Message";
import { Prompt } from "~/types/Dialog/Prompt";

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
    };
  },
};
