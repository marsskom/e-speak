<script setup lang="ts">
import { useSkeletonStore } from "~/stores/skeleton";

const skeletonStore = useSkeletonStore();
const isSkeletonVisible = computed(() => skeletonStore.isVisible);
</script>

<template>
  <div class="loading-content">
    <slot v-if="isSkeletonVisible" name="skeleton">
      <div
        class="skeleton h-screen flex flex-col items-center justify-center space-y-5 w-full"
      >
        <div role="status" class="space-y-2.5 animate-pulse w-[640px]">
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
          </div>
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
            ></div>
          </div>
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
          </div>
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
            ></div>
          </div>
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
            ></div>
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
            ></div>
          </div>
          <div class="flex items-center w-full space-x-2">
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80"
            ></div>
            <div
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
            ></div>
          </div>

          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </slot>

    <slot v-else name="page"></slot>
  </div>
</template>

<style scoped></style>
