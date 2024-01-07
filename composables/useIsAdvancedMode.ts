import { useSettingsStore } from "~/stores/settings";

export default function (): boolean {
  const settingsStore = useSettingsStore();

  return computed(() => settingsStore.settings.advanced.enabled).value;
}
