<script setup lang="ts">
import { User } from "firebase/auth";

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
      {{ user.displayName || "Anonymous" }}
      <svg
        class="w-2.5 h-2.5 ml-2.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>
    <div
      id="dropdownUserData"
      class="z-10 border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg shadow w-44 absolute text-right"
      :class="{
        block: isVisibleDropdown,
        hidden: !isVisibleDropdown,
      }"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li class="px-2 py-2 text-xs">
          {{ user.email }}
        </li>
        <li class="px-2 py-2">
          <LogOutLink />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
