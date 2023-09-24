<script setup lang="ts">
import { Props } from "~/types/NavBar/NavLink";

const props = defineProps<Props>();
</script>

<template>
  <NuxtLink
    :to="props.slug"
    class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
    active-class="text-white bg-blue-700 md:bg-transparent md:text-blue-700"
  >
    <slot></slot>
  </NuxtLink>
</template>

<style scoped></style>
