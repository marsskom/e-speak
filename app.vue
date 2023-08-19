<script setup lang="ts"></script>

<template>
  <div>
    <NuxtLayout>
      <ul>
        <li>
          <NuxtLink
            to="/"
            class="font-semibold text-primary hover:text-gray-400 duration-100"
            >Index
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/about"
            class="font-semibold text-gray-50 hover:text-gray-400 duration-100"
            >About
          </NuxtLink>
        </li>
      </ul>

      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
