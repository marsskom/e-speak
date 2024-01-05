import { type User } from "firebase/auth";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  setDoc,
  writeBatch,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  deleteDoc,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { type Dialog } from "~/types/Dialog/Dialog";
import { type Message } from "~/types/Dialog/Message";
import DialogFactory from "~/models/Dialog/DialogFactory";
import MessageFactory from "~/models/Dialog/MessageFactory";
import MessageResolver from "~/models/Dialog/MessageResolver";
import {
  dialogFirebaseConverter,
  messageFirebaseConverter,
} from "~/models/Dialog/DialogFirebaseConverter";

import { useAudioRecorderStore } from "~/stores/Audio/recorder";

export const useDialogStore = defineStore("dialog", () => {
  const user: User = useGetUser();

  const db = useFirestore();
  const dialogsRef = collection(db, "dialogs").withConverter(
    dialogFirebaseConverter,
  );
  const messagesRef = collection(db, "messages").withConverter(
    messageFirebaseConverter,
  );

  const dialogDocument: Ref<null | DocumentReference> = ref(null);
  let messageBatch: null | ReturnType<typeof writeBatch> = null;

  const dialogFactory: DialogFactory = new DialogFactory();
  const messageFactory: MessageFactory = new MessageFactory();

  const isLoadingInProgress: Ref<boolean> = ref(true);
  const dialog: Ref<Dialog> = ref(dialogFactory.create(user.uid));
  const messageInProgress: Ref<Message> = ref(messageFactory.createEmpty());

  const isLoading: ComputedRef<boolean> = computed(
    () => isLoadingInProgress.value,
  );
  const currentDialog: ComputedRef<Dialog> = computed(() => dialog.value);
  const currentMessageInProgress: ComputedRef<Message> = computed(
    () => messageInProgress.value,
  );

  const addMessage = (message: Message): void => {
    message.dialogUid = dialog.value.uid;
    message.createdAt = new Date();
    dialog.value.messages.push(message);

    messageInProgress.value = messageFactory.createEmpty();

    const resolver = new MessageResolver(
      dialog.value.uid,
      dialog.value.messages,
    );

    resolver
      .askOpenAI()
      .then((messages: Message[]) => {
        dialog.value.messages = messages;
      })
      .finally(() => {
        const audioRecorderStore = useAudioRecorderStore();
        const { activate: activateRecorder } = audioRecorderStore;

        activateRecorder();

        updateDialog(dialog.value.name);
        syncMessages();
      });
  };

  const updateMessage = (message: Message): void => {
    let flag = false;

    for (const i in dialog.value.messages) {
      if (dialog.value.messages[i].uid === message.uid) {
        dialog.value.messages[i] = message;
        flag = true;

        break;
      }
    }

    if (!flag) {
      return;
    }

    syncMessages();
  };

  const updateDialog = (dialogName: string): void => {
    dialog.value.name = dialogName;
    dialog.value.updatedAt = new Date();
    dialog.value.isSynced = true;

    syncDialog();
  };

  const syncDialog = (): void => {
    setDoc(dialogDocument.value, dialog.value);

    localStorage.setItem("dialogUid", dialog.value.uid);
  };

  const syncMessages = (): void => {
    if (dialog.value.messages.length === 0) {
      return;
    }

    messageBatch = writeBatch(db);
    dialog.value.messages.forEach((message: Message) => {
      messageBatch.set(doc(messagesRef, message.uid), message);
    });

    messageBatch.commit();
  };

  const loadDialog = (dialogUid: string): Promise<void> => {
    isLoadingInProgress.value = true;

    dialogDocument.value = doc(dialogsRef, dialogUid);

    return getDoc(dialogDocument.value)
      .then((docSnap: DocumentSnapshot): void => {
        if (!docSnap.exists()) {
          localStorage.setItem("dialogUid", "");

          throw new Error("Dialog not found.");
        }

        dialog.value = docSnap.data() as Dialog;

        localStorage.setItem("dialogUid", dialog.value.uid);
      })
      .then(
        (): Promise<QuerySnapshot<Message>> =>
          getDocs(
            query(
              messagesRef,
              where("dialogUid", "==", dialog.value.uid),
              orderBy("createdAt", "asc"),
            ),
          ),
      )
      .then((querySnapshot: QuerySnapshot<Message>) => {
        const messages: Message[] = [];

        querySnapshot.forEach((docSnap: DocumentSnapshot<Message>) => {
          messages.push(docSnap.data() as Message);
        });

        dialog.value.messages = messages;
      })
      .finally(() => (isLoadingInProgress.value = false));
  };

  const init = () => {
    const dialogUid = localStorage.getItem("dialogUid");

    loadDialog(dialogUid || dialog.value.uid);
  };

  const createEmptyDialog = (): void => {
    isLoadingInProgress.value = true;

    updateDialog(dialog.value.name);
    syncMessages();

    localStorage.setItem("dialogUid", "");
    dialog.value = dialogFactory.create(user.uid);
    dialogDocument.value = doc(dialogsRef, dialog.value.uid);

    isLoadingInProgress.value = false;
  };

  const deleteDialog = async (deleteDialog: Dialog): Promise<void> => {
    isLoadingInProgress.value = true;

    const dialogDocumentReference: DocumentReference = doc(
      dialogsRef,
      deleteDialog.uid,
    );
    await deleteDoc(dialogDocumentReference);

    getDocs(
      query(
        messagesRef,
        where("dialogUid", "==", deleteDialog.uid),
        orderBy("createdAt", "asc"),
      ),
    )
      .then((querySnapshot: QuerySnapshot<Message>) => {
        querySnapshot.forEach(async (docSnap: DocumentSnapshot<Message>) => {
          await deleteDoc(doc(messagesRef, docSnap.id));
        });
      })
      .finally(() => (isLoadingInProgress.value = false));

    if (deleteDialog.uid === dialog.value.uid) {
      localStorage.setItem("dialogUid", "");
      dialog.value = dialogFactory.create(user.uid);
      dialogDocument.value = doc(dialogsRef, dialog.value.uid);
    }

    isLoadingInProgress.value = false;
  };

  return {
    isLoadingInProgress,
    dialog,

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
