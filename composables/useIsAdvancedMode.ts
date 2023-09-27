import { useSettingsStore } from "~/stores/settings";

export default function (): ComputedRef<boolean> {
  const settingsStore = useSettingsStore();

  return computed(() => settingsStore.getSettings.advanced.enabled);
}
