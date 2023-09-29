import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from "firebase/firestore";

import { Settings } from "~/types/Settings.d";
import { Prompt } from "~/types/Dialog/Prompt.d";

export const settingsFirebaseConverter = {
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Settings => {
    const data = snapshot.data(options);

    return {
      ...data,
      updatedAt: data.updatedAt.toDate(),
    } as Settings;
  },
  toFirestore: (settings: WithFieldValue<Settings>): object => {
    if (settings.promptList) {
      settings.promptList?.map(
        (prompt: Prompt) =>
          (prompt.category = Object.assign({}, prompt.category)),
      );
    }

    return {
      ...settings,
      updatedAt: Timestamp.fromDate(settings.updatedAt),
    };
  },
};
