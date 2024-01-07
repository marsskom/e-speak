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
    Logout&nbsp;
    <fa
      :icon="['fas', 'arrow-right-from-bracket']"
      class="text-pink-600 fa-xs"
    />
  </a>
</template>

<style scoped></style>
