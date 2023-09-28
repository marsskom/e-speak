import { useDialogStore } from "~/stores/Dialog/dialog";

export default function (): ComputedRef<boolean> {
  const dialogStore = useDialogStore();

  return computed(() => dialogStore.isLoading);
}
