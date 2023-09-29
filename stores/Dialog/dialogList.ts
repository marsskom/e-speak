import { User } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { Dialog } from "~/types/Dialog/Dialog.d";
import { dialogFirebaseConverter } from "~/models/Dialog/DialogFirebaseConverter";

export const useDialogListStore = defineStore("dialogList", () => {
  const user: User = useGetUser();

  const db = useFirestore();
  const dialogsRef = collection(db, "dialogs").withConverter(
    dialogFirebaseConverter,
  );

  const isLoadingInProgress: Ref<boolean> = ref(false);
  const dialogs: Ref<Dialog[]> = ref([]);

  const loadDialogList = (): Promise<void> => {
    isLoadingInProgress.value = true;

    dialogs.value = [];

    return getDocs(query(dialogsRef, where("userUid", "==", user.uid)))
      .then((querySnapshot: QuerySnapshot<Dialog>) => {
        querySnapshot.forEach((docSnap: DocumentSnapshot<Dialog>) => {
          dialogs.value.push(docSnap.data() as Dialog);
        });
      })
      .finally(() => (isLoadingInProgress.value = false));
  };

  const init = () => {
    loadDialogList();
  };

  const dialogList = computed(() => dialogs.value);
  const isLoading: ComputedRef<boolean> = computed(
    () => isLoadingInProgress.value,
  );

  const refresh = (): Promise<void> => loadDialogList();

  return {
    dialogs,

    dialogList,
    isLoading,

    init,
    refresh,
  };
});
