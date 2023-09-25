import { useSettingsStore } from "~/stores/settings";

export default function () {
  const settingsStore = useSettingsStore();

  return computed(() => settingsStore.getSettings).value;
}
