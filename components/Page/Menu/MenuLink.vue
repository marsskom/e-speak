<script setup lang="ts">
import { type Props } from "~/types/Menu/MenuLink";

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
      <fa
        :icon="['fas', 'list']"
        class="w-3 h-3 text-gray-600 hover:text-gray-900 dark:text-white"
      />

      <span class="ml-3">{{ props.label }}</span>
    </slot>
  </NuxtLink>
</template>

<style scoped></style>
