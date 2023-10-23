import {
  QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
  type WithFieldValue,
} from "firebase/firestore";

import { type Settings } from "~/types/Settings";
import { type Prompt } from "~/types/Dialog/Prompt";

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
