<script setup lang="ts">
import { type User } from "firebase/auth";
import { useAuthStore } from "~/stores/Auth/auth";

import LoadingMask from "~/components/LoadingMask.vue";
import NavBar from "~/components/Page/NavBar.vue";

definePageMeta({
  title: "E-Speak",
});

const router = useRouter();
const route = useRoute();
const user = useCurrentUser();
const { writeUserData } = useAuthStore();

onMounted(() => {
  watch(user, (user) => {
    writeUserData(user as User);
  });

  watch(useIsGuest, (isGuest) => {
    if (isGuest) {
      router.push("/login");
    } else if (!isGuest && typeof route.query.redirect === "string") {
      router.push(route.query.redirect);
    } else if (!isGuest && route.path.includes("/login")) {
      router.push("/");
    }
  });
});
</script>

<template>
  <NuxtLayout>
    <LoadingMask id="app-loading" :is-global="true" />

    <div class="relative flex flex-grow flex-col h-screen">
      <NavBar />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
