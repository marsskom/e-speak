<script setup lang="ts">
import type { ComputedRef } from "vue";

import { useLoadingMaskStore } from "~/stores/loading-mask";
import type { LoadingMaskState } from "~/types/LoadingMask";

const loadingMaskStore = useLoadingMaskStore();
const { registerMask } = loadingMaskStore;

const props = withDefaults(defineProps<LoadingMaskState>(), {
  isGlobal: false,
  isVisible: false,
});

registerMask(props as LoadingMaskState);

const isMaskVisible: ComputedRef<Boolean> = computed(
  () => loadingMaskStore.getRegisteredMaskUidList[props.id],
);
</script>

<template>
  <div
    v-if="props.isGlobal && isMaskVisible"
    :id="props.id"
    class="absolute bottom-0 left-0 right-0 top-0 h-screen w-screen overflow-hidden bg-fixed z-50"
    style="background-color: hsla(0, 0%, 98%, 0.6)"
  >
    <div
      role="status"
      class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-50"
    >
      <fa :icon="['fas', 'spinner']" class="fa-2xl text-gray-400" spin />
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div v-if="!props.isGlobal" class="loading-mask relative">
    <slot></slot>

    <div
      v-if="isMaskVisible"
      class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed"
      style="background-color: hsla(0, 0%, 98%, 0.6)"
    ></div>
    <div
      v-if="isMaskVisible"
      role="status"
      class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
    >
      <fa :icon="['fas', 'spinner']" class="fa-2xl text-gray-400" spin />
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<style scoped></style>
