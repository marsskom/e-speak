<script setup lang="ts">
import { computed } from "vue";
import { useCounterStore } from "~/stores/counter";

const counterStore = useCounterStore();

const getCount = computed(() => counterStore.getCount);
const { increment } = counterStore;
</script>

<template>
  <div>
    <div>
      Counter: <span class="value">{{ getCount }}</span>
    </div>
    <button type="button" @click="increment">+</button>
  </div>
</template>

<style scoped></style>
