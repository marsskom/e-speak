import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message } from "~/types/Dialog/Message.d";
import DialogFactory from "~/models/Dialog/DialogFactory";
import MessageResolver from "~/models/Dialog/MessageResolver";

import { useAudioRecorderStore } from "~/stores/Audio/recorder";

export const useDialogStore = defineStore("dialog", () => {
  const dialog: Ref<Dialog> = ref(DialogFactory.create());

  const currentDialog: ComputedRef<Dialog> = computed(() => dialog.value);

  const addMessage = (message: Message): void => {
    dialog.value.messages.push(message);

    const resolver = new MessageResolver(dialog.value.messages);

    resolver.askOpenAI().finally(() => {
      const audioRecorderStore = useAudioRecorderStore();
      const { activate: activateRecorder } = audioRecorderStore;

      activateRecorder();
    });
  };

  return {
    dialog,

    currentDialog,

    addMessage,
  };
});
