import { useDialogStore } from "~/stores/Dialog/dialog";

export default function (): boolean {
  const dialogStore = useDialogStore();

  return computed(() => dialogStore.isLoading).value;
}
