<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  buttonClass: {
    type: String,
    default: "px-1 text-blue-500 hover:text-blue-600",
  },
});

const isCopied: Ref<boolean> = ref(false);

const copyContent = () => {
  if (isCopied.value) {
    return;
  }

  navigator.clipboard.writeText(props.content);
  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 1000);
};
</script>

<template>
  <button v-if="props.content" :class="props.buttonClass" @click="copyContent">
    <fa v-if="!isCopied" :icon="['fas', 'copy']" title="Copy Value" />
    <fa
      v-else
      :icon="['fas', 'thumbs-up']"
      class="text-green-700"
      title="Copied"
    />
  </button>
</template>

<style scoped></style>
