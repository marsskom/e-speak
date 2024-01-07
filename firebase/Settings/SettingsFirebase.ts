import { useFirestore } from "vuefire";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { ChatDriver, type Settings } from "~/types/Settings";
import { usePromptStore } from "~/stores/Dialog/prompt";
import { settingsFirebaseConverter } from "~/firebase/Settings/SettingsFirebaseConverter";

export default class SettingsFirebase {
  #db = useFirestore();
  #document: Ref<null | DocumentReference> = ref(null);
  #settingsRef: CollectionReference<Settings>;

  constructor() {
    this.#settingsRef = collection(this.#db, "settings").withConverter(
      settingsFirebaseConverter,
    );
  }

  get defaultSettings(): Settings {
    return {
      recorder: {
        minDuration: 2,
        maxDuration: 60,
        audioParams: {
          mimeType: "audio/webm",
          prefix: "%date%/%dialog_uid%/%message_uid%",
        },
      },
      chat: {
        driver: ChatDriver.OpenAI,
      },
      advanced: {
        enabled: false,
      },
      promptList: usePromptStore().defaultPromptList.value,
    } as Settings;
  }

  get isSynced(): boolean {
    return this.#document.value !== null;
  }

  async select(userId: string): Promise<Settings> {
    this.#document.value = doc(this.#settingsRef, userId);

    const docSnap: DocumentSnapshot = await getDoc(this.#document.value);
    if (docSnap.exists()) {
      return docSnap.data() as Settings;
    }

    throw new Error("Settings not found");
  }

  save(settings: Settings): Promise<void> {
    if (this.#document.value === null) {
      throw new Error("Settings not selected");
    }

    return setDoc(this.#document.value, settings);
  }
}
