<script setup lang="ts">
import { useLoginFormStore } from "~/stores/Form/login-form";

import { useSkeletonStore } from "~/stores/skeleton";

import GoogleAuthComponent from "~/components/Auth/GoogleAuthComponent.vue";
import AgreementCheckbox from "~/components/Form/Input/Checkbox/AgreementCheckbox.vue";

const loginFormStore = useLoginFormStore();
const isInProcess = computed(() => loginFormStore.isInProcess);

const { hide: hideSkeleton } = useSkeletonStore();

onMounted(() => {
  if (useIsGuest()) {
    hideSkeleton();
  }
});
</script>

<template>
  <PageSkeleton>
    <template #page>
      <LoadingMask :is-visible="isInProcess">
        <section
          id="login"
          class="h-screen flex flex-col items-center justify-center space-y-5"
        >
          <p class="text-pink-500 text-xl mb-3">Welcome to E-Speak</p>

          <form v-if="useIsGuest()" autocomplete="off">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
              <AgreementCheckbox />
            </div>

            <GoogleAuthComponent />
          </form>

          <div v-else>
            <p class="text-pink-500 text-xl mb-3">You have logged in</p>
          </div>
        </section>
      </LoadingMask>
    </template>
  </PageSkeleton>
</template>

<style scoped></style>
