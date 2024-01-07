import { type Settings } from "~/types/Settings";
import { useSettingsStore } from "~/stores/settings";

export default function (): Settings {
  const settingsStore = useSettingsStore();

  return computed(() => settingsStore.settings).value;
}
