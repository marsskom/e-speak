import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message } from "~/types/Dialog/Message.d";
import DialogFactory from "~/models/Dialog/DialogFactory";

export const useDialogStore = defineStore("dialog", () => {
  const dialog: Ref<Dialog> = ref(DialogFactory.create());

  const currentDialog: ComputedRef<Dialog> = computed(() => dialog.value);

  const addMessage = (message: Message): void => {
    dialog.value.messages.push(message);
  };

  return {
    dialog,

    currentDialog,

    addMessage,
  };
});
