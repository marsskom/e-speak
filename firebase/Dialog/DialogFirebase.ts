import { useFirestore } from "vuefire";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  runTransaction,
  setDoc,
  Transaction,
  where,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";

import type { Dialog } from "~/types/Dialog/Dialog";
import type { Message } from "~/types/Dialog/Message";
import {
  dialogFirebaseConverter,
  messageFirebaseConverter,
} from "~/firebase/Dialog/DialogFirebaseConverter";

export default class DialogFirebase {
  #db: Firestore = useFirestore();
  #dialogRef: CollectionReference<Dialog>;
  #messageRef: CollectionReference<Message>;

  constructor() {
    this.#dialogRef = collection(this.#db, "dialogs").withConverter(
      dialogFirebaseConverter,
    );
    this.#messageRef = collection(this.#db, "messages").withConverter(
      messageFirebaseConverter,
    );
  }

  #getMessageQuerySnapshot(dialogId: string): Promise<QuerySnapshot<Message>> {
    return getDocs(
      query(
        this.#messageRef,
        where("dialogUid", "==", dialogId),
        orderBy("createdAt", "asc"),
      ),
    );
  }

  async select(dialogId: string): Promise<Dialog> {
    const dialogDocument: DocumentReference<Dialog> = doc(
      this.#dialogRef,
      dialogId,
    );
    const docSnap: DocumentSnapshot<Dialog> = await getDoc(dialogDocument);
    if (!docSnap.exists()) {
      throw new Error("Dialog not found");
    }

    const dialog: Dialog = docSnap.data() as Dialog;
    dialog.messages = [];

    const messageQuerySnapshot: QuerySnapshot<Message> =
      await this.#getMessageQuerySnapshot(dialog.uid);

    messageQuerySnapshot.forEach((docSnap: DocumentSnapshot<Message>): void => {
      dialog.messages.push(docSnap.data() as Message);
    });

    return dialog;
  }

  save(dialog: Dialog): Promise<void> {
    return setDoc(doc(this.#dialogRef, dialog.uid), dialog);
  }

  saveMessages(messages: Message[]): Promise<void> {
    const messageBatch: WriteBatch = writeBatch(this.#db);

    messages.forEach((message: Message) => {
      messageBatch.set(doc(this.#messageRef, message.uid), message);
    });

    return messageBatch.commit();
  }

  delete(dialog: Dialog): Promise<void> {
    return runTransaction(
      this.#db,
      async (transaction: Transaction): Promise<void> => {
        transaction.delete(doc(this.#dialogRef, dialog.uid));

        const messageQuerySnapshot: QuerySnapshot<Message> =
          await this.#getMessageQuerySnapshot(dialog.uid);

        messageQuerySnapshot.forEach(
          (docSnap: DocumentSnapshot<Message>): void => {
            transaction.delete(doc(this.#messageRef, docSnap.id));
          },
        );
      },
    );
  }
}
