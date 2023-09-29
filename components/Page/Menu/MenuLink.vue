<script setup lang="ts">
import { Props } from "~/types/Menu/MenuLink";

const props = withDefaults(defineProps<Props>(), {
  label: "Menu Item",
  isActive: false,
});
</script>

<template>
  <NuxtLink
    :to="props.slug"
    class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-5/6"
  >
    <slot>
      <svg
        class="w-4 h-4 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 14 20"
      >
        <path
          d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"
        ></path>
      </svg>

      <span class="ml-3">{{ props.label }}</span>
    </slot>
  </NuxtLink>
</template>

<style scoped></style>
