<script setup lang="ts">
import { signInAnonymously, type UserCredential } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { useToast } from "tailvue";

import { useLoginFormStore } from "~/stores/Form/login-form";
import { useAuthStore } from "~/stores/Auth/auth";

const toast = useToast();
const loginFormStore = useLoginFormStore();
const isAgreementAccepted = computed(() => loginFormStore.isAgreementAccepted);
const { setInProcess } = loginFormStore;

const { writeUserData } = useAuthStore();

const auth = useFirebaseAuth()!;

const singIn = function () {
  setInProcess(true);

  signInAnonymously(auth)
    .then((result: UserCredential) => writeUserData(result.user))
    .catch((reason: string) => toast.danger(reason))
    .finally(() => setInProcess(false));
};
</script>

<template>
  <div class="px-6 sm:px-0 max-w-full">
    <button
      type="button"
      class="text-white w-full bg-[#ff4d4d] hover:bg-[#ff1b1b]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2 disabled:bg-gray-700 disabled:border-gray-600"
      :disabled="false === isAgreementAccepted"
      @click="singIn"
    >
      <svg
        class="mr-2 -ml-1 w-4 h-4"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        ></path>
      </svg>
      Sign In Anonymously
      <span></span>
    </button>
  </div>
</template>

<style></style>
