import { ChatDriver, Settings } from "~/types/Settings.d";

export const useSettingsStore = defineStore("settings", () => {
  const settings: Ref<Settings> = ref({
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
  } as Settings);

  const getSettings: ComputedRef<Settings> = computed(
    (): Settings => settings.value,
  );

  return {
    settings,

    getSettings,
  };
});
