import { type User } from "firebase/auth";
import {
  collection,
  DocumentSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

import { type Dialog } from "~/types/Dialog/Dialog";
import { dialogFirebaseConverter } from "~/models/Dialog/DialogFirebaseConverter";

export const useDialogListStore = defineStore("dialogList", () => {
  const user: User = useGetUser();

  const db = useFirestore();
  const dialogListRef = collection(db, "dialogs").withConverter(
    dialogFirebaseConverter,
  );

  const isLoadingInProgress: Ref<boolean> = ref(false);
  const dialogListValue: Ref<Dialog[]> = ref([]);

  const loadDialogList = async (): Promise<void> => {
    isLoadingInProgress.value = true;

    dialogListValue.value = [];

    try {
      const querySnapshot = await getDocs(
        query(dialogListRef, where("userUid", "==", user.uid)),
      );
      querySnapshot.forEach((docSnap: DocumentSnapshot<Dialog>) => {
        dialogListValue.value.push(docSnap.data() as Dialog);
      });
    } finally {
      isLoadingInProgress.value = false;
    }
  };

  const init = () => {
    loadDialogList();
  };

  const dialogList = computed(() => dialogListValue.value);
  const isLoading: ComputedRef<boolean> = computed(
    () => isLoadingInProgress.value,
  );

  const refresh = (): Promise<void> => loadDialogList();

  return {
    dialogList,
    isLoading,

    init,
    refresh,
  };
});
