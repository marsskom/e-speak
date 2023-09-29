import { User } from "firebase/auth";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { ChatDriver, Settings } from "~/types/Settings.d";
import { Prompt } from "~/types/Dialog/Prompt.d";
import { settingsFirebaseConverter } from "~/models/SettingsFirebaseConverter";

export const useSettingsStore = defineStore("settings", () => {
  const user: User = useGetUser();

  const defaultSettings: Settings = {
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
    promptList: [],
  } as Settings;

  const db = useFirestore();
  const settingsRef = collection(db, "settings").withConverter(
    settingsFirebaseConverter,
  );
  const document: Ref<null | DocumentReference> = ref(null);

  const settings: Ref<Settings> = ref(
    useDeepClone(defaultSettings) as Settings,
  );
  const isEditableSettings: Ref<boolean> = ref(false);

  const getSettings: ComputedRef<Settings> = computed(
    (): Settings => settings.value,
  );
  const isEditable: ComputedRef<boolean> = computed(
    (): boolean => isEditableSettings.value,
  );

  let syncTimeoutId: ReturnType<typeof setTimeout>;
  const syncSettings = (settings: Settings): void => {
    clearTimeout(syncTimeoutId);
    syncTimeoutId = setTimeout(() => {
      setDoc(document.value, settings);
    }, 1000);
  };

  watch(
    settings,
    (value: Settings) => {
      if (!isEditableSettings.value || document.value === null) {
        return;
      }

      syncSettings({ ...value, updatedAt: new Date() });
    },
    { deep: true },
  );

  const init = async () => {
    document.value = doc(settingsRef, user.uid);

    await getDoc(document.value).then((docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        settings.value = useDeepClone(docSnap.data() as Settings);
      }

      isEditableSettings.value = true;
    });
  };

  const reset = (): void => {
    settings.value = useDeepClone(defaultSettings) as Settings;
  };

  const setPromptList = (promptList: Prompt[]): void => {
    settings.value.promptList = promptList;
  };

  return {
    settings,
    isEditableSettings,

    getSettings,
    isEditable,

    init,
    reset,
    setPromptList,
  };
});
