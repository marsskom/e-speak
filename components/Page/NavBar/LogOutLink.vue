<script setup lang="ts">
import { useModal } from "tailvue";
import { useFirebaseAuth } from "vuefire";

import { useAuthStore } from "~/stores/Auth/auth";

const { writeUserData } = useAuthStore();

const auth = useFirebaseAuth()!;
const modal = useModal();

const logOut = (event: Event): void => {
  event.preventDefault();

  modal.show({
    type: "danger",
    title: "Are you really want to log out?",
    primary: {
      label: "Yes",
      theme: "red",
      action: () => {
        auth.signOut();

        writeUserData(null);
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};
</script>

<template>
  <a href="#" class="hover:underline" @click="logOut">
    Logout
    <svg
      class="h-4 w-4 text-pink-500 inline-block ml-1"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path
        d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
      />
      <path d="M7 12h14l-3 -3m0 6l3 -3" />
    </svg>
  </a>
</template>

<style scoped></style>
