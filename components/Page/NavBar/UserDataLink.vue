<script setup lang="ts">
import { type User } from "firebase/auth";

import LogOutLink from "~/components/Page/NavBar/LogOutLink.vue";

const el = ref(null);
const user: User = useGetUser();
const isVisibleDropdown = ref(false);

const toggleDropdown = () => {
  isVisibleDropdown.value = !isVisibleDropdown.value;
};

const closeDropdown = (event: Event) => {
  if (el.value?.contains(event.target)) {
    return;
  }

  isVisibleDropdown.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div ref="el">
    <button
      class="flex items-center px-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      data-dropdown-toggle="dropdownUserData"
      data-dropdown-placement="bottom"
      @click="toggleDropdown"
    >
      <img
        v-if="user.photoURL?.length || false"
        class="w-6 h-6 mr-2 rounded-full"
        :src="user.photoURL"
        :alt="user.displayName || ''"
      />
      {{ user.displayName || "Anonymous" }}&nbsp;
      <fa :icon="['fas', 'angles-down']" class="text-pink-600 fa-xs" />
    </button>
    <div
      id="dropdownUserData"
      class="z-10 border-gray-500 rounded-b-lg bg-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg shadow w-44 absolute text-right md:right-0"
      :class="{
        block: isVisibleDropdown,
        hidden: !isVisibleDropdown,
      }"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li v-if="user.email?.length" class="px-2 py-2 text-xs">
          {{ user.email }}
        </li>
        <li class="px-2 py-2 mr-5">
          <LogOutLink />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
