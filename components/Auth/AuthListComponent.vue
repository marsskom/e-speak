<script setup lang="ts">
import type { ComputedRef } from "vue";

import GoogleAuthComponent from "~/components/Auth/GoogleAuthComponent.vue";
import AnonymousAuthComponent from "~/components/Auth/AnonymousAuthComponent.vue";
import { useLoginFormStore } from "~/stores/Form/login-form";
import { useAuthStore } from "~/stores/Auth/auth";
import type {
  EventSignedIn,
  EventSignedInError,
  EventSigningInProcess,
} from "~/types/Auth/Auth";
import { useLoadingMaskStore } from "~/stores/loading-mask";

const { setVisibility: setMaskVisibility } = useLoadingMaskStore();
const { writeUserData } = useAuthStore();

const { $toast } = useNuxtApp();
const loginFormStore = useLoginFormStore();
const isAgreementAccepted: ComputedRef<boolean> = computed(
  () => loginFormStore.isAgreementAccepted,
);

const signedIn = (event: EventSignedIn) => {
  setMaskVisibility("login-loading", false);

  writeUserData(event.userCredential.user);
};

const signedInError = (event: EventSignedInError) => {
  $toast.danger(event.error);
  setMaskVisibility("login-loading", false);
};

const signingInProcess = (event: EventSigningInProcess) => {
  setMaskVisibility("login-loading", event.value);
};
</script>

<template>
  <GoogleAuthComponent
    :is-agreement-accepted="isAgreementAccepted"
    @signed-in="signedIn"
    @signed-in-error="signedInError"
    @signing-in-process="signingInProcess"
  />
  <AnonymousAuthComponent
    v-if="$config.public.envIsDev"
    :is-agreement-accepted="isAgreementAccepted"
    @signed-in="signedIn"
    @signed-in-error="signedInError"
    @signing-in-process="signingInProcess"
  />
</template>

<style scoped></style>
