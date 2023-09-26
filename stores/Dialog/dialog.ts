import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message } from "~/types/Dialog/Message.d";
import DialogFactory from "~/models/Dialog/DialogFactory";
import MessageFactory from "~/models/Dialog/MessageFactory";
import MessageResolver from "~/models/Dialog/MessageResolver";

import { useAudioRecorderStore } from "~/stores/Audio/recorder";

export const useDialogStore = defineStore("dialog", () => {
  const dialogFactory: DialogFactory = new DialogFactory();
  const messageFactory: MessageFactory = new MessageFactory();

  const dialog: Ref<Dialog> = ref(dialogFactory.create());
  const messageInProgress: Ref<Message> = ref(messageFactory.createEmpty());

  const currentDialog: ComputedRef<Dialog> = computed(() => dialog.value);
  const currentMessageInProgress: ComputedRef<Message> = computed(
    () => messageInProgress.value,
  );

  const addMessage = (message: Message): void => {
    dialog.value.messages.push(message);
    messageInProgress.value = messageFactory.createEmpty();

    const resolver = new MessageResolver(dialog.value.messages);

    resolver
      .askOpenAI()
      .then((messages: Message[]) => {
        dialog.value.messages = messages;
      })
      .finally(() => {
        const audioRecorderStore = useAudioRecorderStore();
        const { activate: activateRecorder } = audioRecorderStore;

        activateRecorder();
      });
  };

  return {
    dialog,

    currentDialog,
    currentMessageInProgress,

    addMessage,
  };
});
