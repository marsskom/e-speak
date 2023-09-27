import { Settings } from "~/types/Settings.d";
import { useSettingsStore } from "~/stores/settings";

export default function (): Settings {
  const settingsStore = useSettingsStore();

  return computed(() => settingsStore.getSettings).value;
}
