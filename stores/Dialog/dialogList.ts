import { type Dialog } from "~/types/Dialog/Dialog";
import DialogListFirebase from "~/firebase/Dialog/DialogListFirebase";

export const useDialogListStore = defineStore("dialogList", () => {
  const storeModel: DialogListFirebase = new DialogListFirebase();

  const isLoadingInProgress: Ref<boolean> = ref(false);
  const dialogListValue: Ref<Dialog[]> = ref([]);

  const loadDialogList = async (): Promise<void> => {
    isLoadingInProgress.value = true;

    dialogListValue.value = [];

    try {
      dialogListValue.value = await storeModel.select(useGetUser().uid);
    } finally {
      isLoadingInProgress.value = false;
    }
  };

  const init = (): void => {
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
