<script setup lang="ts">
import NavLink from "~/components/Page/NavBar/NavLink.vue";
import UserDataLink from "~/components/Page/NavBar/UserDataLink.vue";
</script>

<template>
  <nav
    class="flex-1 w-full bg-white border-gray-200 dark:bg-gray-900 min-h-[64px]"
  >
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <NuxtLink to="/" class="flex items-center">
        <svg
          class="h-8 w-8 text-pink-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >E-Speak</span
        >
      </NuxtLink>
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <div id="navbar-default" class="hidden w-full md:block md:w-auto">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center justify-center"
        >
          <li>
            <NavLink slug="/">Learn</NavLink>
          </li>
          <li>
            <NavLink slug="/about">About</NavLink>
          </li>
          <li v-if="!useIsGuest()">
            <UserDataLink />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
