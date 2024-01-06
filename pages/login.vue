<script setup lang="ts">
import LoadingMask from "~/components/LoadingMask.vue";
import AgreementCheckbox from "~/components/Form/Input/Checkbox/AgreementCheckbox.vue";
import AuthListComponent from "~/components/Auth/AuthListComponent.vue";
import { useLoginFormStore } from "~/stores/Form/login-form";

definePageMeta({
  title: "E-Speak - Sing In",
});

const loginFormStore = useLoginFormStore();
const { declineAgreement } = loginFormStore;

onMounted(() => {
  if (useIsGuest()) {
    declineAgreement();
  }
});
</script>

<template>
  <LoadingMask id="login-loading" :is-visible="!useIsGuest()">
    <section
      id="login"
      class="h-screen flex flex-col items-center justify-center space-y-5"
    >
      <p class="text-pink-500 text-xl mb-3">Welcome to E-Speak</p>

      <form v-if="useIsGuest()" autocomplete="off">
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <AgreementCheckbox />
        </div>

        <AuthListComponent />
      </form>

      <div v-if="!useIsGuest()">
        <p class="text-pink-500 text-xl mb-3">You have logged in</p>
      </div>
    </section>
  </LoadingMask>
</template>

<style scoped></style>
