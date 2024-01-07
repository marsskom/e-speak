import { type Dialog } from "~/types/Dialog/Dialog";
import { type Message } from "~/types/Dialog/Message";
import DialogFactory from "~/models/Dialog/DialogFactory";
import MessageFactory from "~/models/Dialog/MessageFactory";
import MessageResolver from "~/models/Dialog/MessageResolver";
import DialogFirebase from "~/firebase/Dialog/DialogFirebase";

export const useDialogStore = defineStore("dialog", () => {
  const storeModel: DialogFirebase = new DialogFirebase();
  const dialogFactory: DialogFactory = new DialogFactory();
  const messageFactory: MessageFactory = new MessageFactory();

  const isLoadingValue: Ref<boolean> = ref(true);
  const dialogValue: Ref<Dialog> = ref(dialogFactory.create(useGetUser().uid));
  const messageInProgress: Ref<Message> = ref(messageFactory.createEmpty());

  const isLoading: ComputedRef<boolean> = computed(() => isLoadingValue.value);
  const currentDialog: ComputedRef<Dialog> = computed(() => dialogValue.value);
  const currentMessageInProgress: ComputedRef<Message> = computed(
    () => messageInProgress.value,
  );

  const addMessage = async (message: Message): Promise<void> => {
    message.dialogUid = dialogValue.value.uid;
    message.createdAt = new Date();
    dialogValue.value.messages.push(message);

    messageInProgress.value = messageFactory.createEmpty();

    try {
      dialogValue.value.messages = await new MessageResolver(
        dialogValue.value.uid,
        dialogValue.value.messages,
      ).askOpenAI();
    } finally {
      updateDialog(dialogValue.value.name);
      storeModel.saveMessages(dialogValue.value.messages);
    }
  };

  const updateMessage = (message: Message): void => {
    let flag = false;

    for (const i in dialogValue.value.messages) {
      if (dialogValue.value.messages[i].uid === message.uid) {
        dialogValue.value.messages[i] = message;
        flag = true;

        break;
      }
    }

    if (!flag) {
      return;
    }

    storeModel.saveMessages(dialogValue.value.messages);
  };

  const updateDialog = (name: string): void => {
    dialogValue.value.name = name;
    dialogValue.value.updatedAt = new Date();
    dialogValue.value.isSynced = true;

    storeModel.save(dialogValue.value);
  };

  const loadDialog = async (dialogUid: string): Promise<void> => {
    isLoadingValue.value = true;

    try {
      dialogValue.value = await storeModel.select(dialogUid);
    } catch (error) {
      localStorage.setItem("dialogUid", "");
    }

    localStorage.setItem("dialogUid", dialogValue.value.uid);
    isLoadingValue.value = false;
  };

  const init = () => {
    const dialogUid: null | string = localStorage.getItem("dialogUid");

    loadDialog(dialogUid || dialogValue.value.uid);
  };

  const createEmptyDialog = (): void => {
    isLoadingValue.value = true;

    updateDialog(dialogValue.value.name);
    storeModel.saveMessages(dialogValue.value.messages);

    localStorage.setItem("dialogUid", "");
    dialogValue.value = dialogFactory.create(useGetUser().uid);

    isLoadingValue.value = false;
  };

  const deleteDialog = async (deleteDialog: Dialog): Promise<void> => {
    isLoadingValue.value = true;

    try {
      await storeModel.delete(deleteDialog);
    } finally {
      isLoadingValue.value = false;
    }

    if (deleteDialog.uid === dialogValue.value.uid) {
      localStorage.setItem("dialogUid", "");
      dialogValue.value = dialogFactory.create(useGetUser().uid);
    }
  };

  return {
    isLoading,
    currentDialog,
    currentMessageInProgress,

    init,
    addMessage,
    updateMessage,
    loadDialog,
    updateDialog,
    createEmptyDialog,
    deleteDialog,
  };
});
