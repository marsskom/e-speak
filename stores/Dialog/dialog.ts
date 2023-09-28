import { User } from "firebase/auth";
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
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { Dialog } from "~/types/Dialog/Dialog.d";
import { Message } from "~/types/Dialog/Message.d";
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

  const updateDialog = (dialogName: string): void => {
    dialog.value.name = dialogName;
    dialog.value.updatedAt = new Date();

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

  const loadDialog = async (dialogUid: string): Promise<void> => {
    isLoadingInProgress.value = true;

    dialogDocument.value = doc(dialogsRef, dialogUid);

    await getDoc(dialogDocument.value)
      .then((docSnap: DocumentSnapshot): void => {
        if (!docSnap.exists()) {
          localStorage.setItem("dialogUid", "");

          throw new Error("Dialog not found.");
        }

        dialog.value = docSnap.data() as Dialog;

        localStorage.setItem("dialogUid", dialog.value.uid);
      })
      .then(
        (): Promise<QuerySnapshot> =>
          getDocs(
            query(
              messagesRef,
              where("dialogUid", "==", dialog.value.uid),
              orderBy("createdAt", "asc"),
            ),
          ),
      )
      .then((querySnapshot: QuerySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          dialog.value.messages.push(docSnap.data() as Message);
        });
      })
      .finally(() => (isLoadingInProgress.value = false));
  };

  onMounted(() => {
    const dialogUid = localStorage.getItem("dialogUid");

    loadDialog(dialogUid || dialog.value.uid);
  });

  return {
    isLoadingInProgress,
    dialog,

    isLoading,
    currentDialog,
    currentMessageInProgress,

    addMessage,
    loadDialog,
  };
});
