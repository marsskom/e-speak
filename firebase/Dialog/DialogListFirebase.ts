import { useFirestore } from "vuefire";
import {
  collection,
  CollectionReference,
  DocumentSnapshot,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { dialogFirebaseConverter } from "~/firebase/Dialog/DialogFirebaseConverter";
import type { Dialog } from "~/types/Dialog/Dialog";

export default class DialogListFirebase {
  #db = useFirestore();
  #dialogListRef: CollectionReference<Dialog>;

  constructor() {
    this.#dialogListRef = collection(this.#db, "dialogs").withConverter(
      dialogFirebaseConverter,
    );
  }

  async select(userId: string): Promise<Dialog[]> {
    const querySnapshot: QuerySnapshot<Dialog> = await getDocs(
      query(this.#dialogListRef, where("userUid", "==", userId)),
    );

    const dialogList: Dialog[] = [];
    querySnapshot.forEach((docSnap: DocumentSnapshot<Dialog>): void => {
      dialogList.push(docSnap.data() as Dialog);
    });

    return dialogList;
  }
}
