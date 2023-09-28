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
  } as Settings;

  const db = useFirestore();
  const settingsRef = collection(db, "settings");
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

  const update = (value: Settings): void => {
    settings.value = useDeepClone(value) as Settings;
    settings.value.updatedAt = new Date();
  };
  const reset = (): void => update(defaultSettings);

  let syncTimeoutId: ReturnType<typeof setTimeout>;
  watch(
    settings,
    (value: Settings) => {
      if (!isEditableSettings.value || document.value === null) {
        return;
      }

      clearTimeout(syncTimeoutId);
      syncTimeoutId = setTimeout(() => {
        setDoc(document.value, value);
      }, 1000);
    },
    { deep: true },
  );

  onMounted(async () => {
    document.value = doc(settingsRef, user.uid);

    await getDoc(document.value).then((docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        settings.value = useDeepClone(docSnap.data() as Settings);
      }

      isEditableSettings.value = true;
    });
  });

  return {
    settings,
    isEditableSettings,

    getSettings,
    isEditable,

    reset,
  };
});
