<script setup lang="ts">
import DashboardLink from "~/components/Page/Menu/DashboardLink.vue";
import DialogListLink from "~/components/Page/Menu/DialogListLink.vue";
</script>

<template>
  <aside class="w-1/5 bg-gray-200">
    <div class="w-full">
      <ul class="list-none text-base p-2">
        <li>
          <DashboardLink />
        </li>

        <li>
          <DialogListLink />
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped></style>
