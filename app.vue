<script setup lang="ts">
import { User } from "firebase/auth";
import { useAuthStore } from "~/stores/Auth/auth";

import NavBar from "~/components/Page/NavBar.vue";

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
    <div class="relative flex flex-grow flex-col h-screen">
      <NavBar />

      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
