import type { LoadingMaskState } from "~/types/LoadingMask";

export const useLoadingMaskStore = defineStore("loading-mask", () => {
  const registeredMaskUidList: Ref<object> = ref({});

  const getRegisteredMaskUidList: ComputedRef<object> = computed(
    () => registeredMaskUidList.value,
  );

  const registerMask = (mask: LoadingMaskState): void => {
    registeredMaskUidList.value[mask.id] = mask.isVisible;
  };
  const isMaskVisible = (mask: LoadingMaskState): boolean => {
    return registeredMaskUidList.value[mask.id];
  };
  const setVisibility = (id: string, isVisible: boolean): void => {
    registeredMaskUidList.value[id] = isVisible;
  };

  return {
    getRegisteredMaskUidList,

    registerMask,
    isMaskVisible,
    setVisibility,
  };
});
