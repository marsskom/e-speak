<script setup lang="ts">
import NavLink from "~/components/Page/NavBar/NavLink.vue";
import UserDataLink from "~/components/Page/NavBar/UserDataLink.vue";

const elMenu: Ref<null | HTMLDivElement> = ref(null);
const isMenuVisible: Ref<boolean> = ref(false);

const hamClick = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const closeMenu = (event: Event) => {
  if (elMenu.value?.contains(event.target as Node)) {
    return;
  }

  isMenuVisible.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<template>
  <nav
    class="flex-1 w-full bg-white border-gray-200 dark:bg-gray-900 min-h-[64px]"
  >
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <NuxtLink to="/" class="flex items-center">
        <fa :icon="['fas', 'comments']" class="text-pink-600 fa-xl" />&nbsp;
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-pink-600"
          >E-Speak</span
        >
      </NuxtLink>

      <section ref="elMenu">
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
          @click="hamClick"
        >
          <span class="sr-only">Open main menu</span>
          <fa :icon="['fas', 'hamburger']" class="text-pink-600 fa-xl" />
        </button>

        <div
          class="w-full md:block md:w-auto z-10"
          :class="isMenuVisible ? 'absolute right-0' : 'hidden'"
        >
          <ul
            class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center justify-center"
          >
            <li>
              <NavLink slug="/" class="menu-link">Learn</NavLink>
            </li>
            <li>
              <NavLink slug="/about" class="menu-link">About</NavLink>
            </li>
            <li v-if="!useIsGuest()">
              <UserDataLink />
            </li>
          </ul>
        </div>
      </section>
    </div>
  </nav>
</template>

<style scoped></style>
