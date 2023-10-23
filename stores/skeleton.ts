import { SkeletonState } from "~/types/Skeleton";

export const useSkeletonStore = defineStore("skeleton", () => {
  const skeletonState: Ref<SkeletonState> = ref(SkeletonState.PageIsLoading);

  const isVisible: ComputedRef<boolean> = computed(
    () => skeletonState.value === SkeletonState.PageIsLoading,
  );

  const show = (): void => {
    skeletonState.value = SkeletonState.PageIsLoading;
  };
  const hide = (): void => {
    skeletonState.value = SkeletonState.PageLoaded;
  };

  return {
    skeletonState,

    isVisible,

    show,
    hide,
  };
});
