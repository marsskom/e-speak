<script setup lang="ts">
import {
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

import type {
  AuthMethodProps,
  EventSignedIn,
  EventSignedInError,
  EventSigningInProcess,
} from "~/types/Auth/Auth";

const props = defineProps<AuthMethodProps>();
const emit = defineEmits<{
  (e: "signedIn", value: EventSignedIn): void;
  (e: "signedInError", value: EventSignedInError): void;
  (e: "signingInProcess", value: EventSigningInProcess): void;
}>();

const auth = useFirebaseAuth()!;

const singIn = () => {
  emit("signingInProcess", {
    value: true,
  } as EventSigningInProcess);

  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result: UserCredential) =>
      emit("signedIn", {
        userCredential: result,
      } as EventSignedIn),
    )
    .catch((reason: string) =>
      emit("signedInError", {
        error: reason,
      } as EventSignedInError),
    );
};
</script>

<template>
  <div class="px-6 sm:px-0 max-w-full">
    <button
      type="button"
      class="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2 disabled:bg-gray-700 disabled:border-gray-600"
      :disabled="!props.isAgreementAccepted"
      @click="singIn"
    >
      <fa :icon="['fab', 'google']" />
      Sign up with Google
      <span></span>
    </button>
  </div>
</template>

<style scoped></style>
