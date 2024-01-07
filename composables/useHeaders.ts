import { type Settings } from "~/types/Settings";
import { useDialogStore } from "~/stores/Dialog/dialog";

// TODO [STORES]: why stores aren't available on server side?
export default function (): object {
  const settings: Settings = useGetSettings();
  const dialogStore = useDialogStore();

  return computed(() => ({
    "X-audio-mime-type": settings.recorder.audioParams?.mimeType || "",
    "X-audio-prefix": settings.recorder.audioParams?.prefix || "",
    "X-audio-dialog-uid": dialogStore.currentDialog.uid,
    "X-audio-message-uid": dialogStore.currentMessageInProgress.uid,
    "X-chat-driver": settings.chat.driver,
  })).value;
}
