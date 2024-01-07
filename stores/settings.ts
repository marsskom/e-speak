import { type Settings } from "~/types/Settings";
import { type Prompt } from "~/types/Dialog/Prompt";
import SettingsFirebase from "~/firebase/Settings/SettingsFirebase";

export const useSettingsStore = defineStore("settings", () => {
  const storeModel: SettingsFirebase = new SettingsFirebase();

  const settingsValue: Ref<Settings> = ref(
    useDeepClone(storeModel.defaultSettings) as Settings,
  );
  const isEditableValue: Ref<boolean> = ref(false);

  const settings: ComputedRef<Settings> = computed(
    (): Settings => settingsValue.value,
  );
  const isEditable: ComputedRef<boolean> = computed(
    (): boolean => isEditableValue.value,
  );

  let syncTimeoutId: ReturnType<typeof setTimeout>;
  const syncSettings = (newSettingsValue: Settings): void => {
    clearTimeout(syncTimeoutId);

    syncTimeoutId = setTimeout(() => {
      storeModel.save(newSettingsValue);
    }, 1000);
  };

  watch(
    settingsValue,
    (value: Settings) => {
      if (!isEditableValue.value || !storeModel.isSynced) {
        return;
      }

      syncSettings({ ...useDeepClone(value), updatedAt: new Date() });
    },
    { deep: true },
  );

  const init = async (): Promise<void> => {
    try {
      const settings = await storeModel.select(useGetUser().uid);
      settingsValue.value = useDeepClone(settings) as Settings;
    } finally {
      isEditableValue.value = true;
    }
  };

  const reset = (): void => {
    settingsValue.value = useDeepClone(storeModel.defaultSettings) as Settings;
  };

  const setPromptList = (promptList: Prompt[]): void => {
    settingsValue.value.promptList = promptList;
  };

  return {
    settings,
    isEditable,

    init,
    reset,
    setPromptList,
  };
});
