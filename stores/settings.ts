import { ChatDriver, Settings } from "~/types/Settings.d";

export const useSettingsStore = defineStore("settings", () => {
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

  const settings: Ref<Settings> = ref(
    useDeepClone(defaultSettings) as Settings,
  );

  const getSettings: ComputedRef<Settings> = computed(
    (): Settings => settings.value,
  );

  const reset = (): void => (settings.value = useDeepClone(defaultSettings));

  return {
    settings,

    getSettings,

    reset,
  };
});
