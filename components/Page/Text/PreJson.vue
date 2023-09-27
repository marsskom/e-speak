<script setup lang="ts">
import CopyLink from "~/components/Page/CopyLink.vue";

const props = defineProps({
  content: {
    type: [Object, Array, String, Number, Boolean],
    required: true,
  },
  withCopyLink: {
    type: Boolean,
    default: true,
  },
  lineClamp: {
    type: Number,
    default: 6,
  },
  buttonClass: {
    type: String,
    default: "px-1 text-blue-500 hover:text-blue-600 inline-block",
  },
});

const isTruncated: Ref<boolean> = ref(true);

const toggleTruncate: Function = (): void => {
  isTruncated.value = !isTruncated.value;
};

const buttonTitle: ComputedRef<string> = computed((): string => {
  if (isTruncated.value) {
    return "Show full content";
  }

  return "Hide full content";
});

const json: ComputedRef<string> = computed(() =>
  JSON.stringify(props.content || "", null, 2),
);

const isJsonExisted: ComputedRef<boolean> = computed(
  () => json.value.length && json.value !== '""',
);
</script>

<template>
  <div v-if="isJsonExisted">
    <CopyLink
      v-if="props.withCopyLink"
      :content="json"
      :button-class="props.buttonClass"
    />
    <button :class="props.buttonClass" @click="toggleTruncate">
      <fa
        :icon="['fas', isTruncated ? 'toggle-off' : 'toggle-on']"
        :title="buttonTitle"
      />
    </button>
    <pre
      :class="isTruncated ? 'truncate line-clamp-' + props.lineClamp : ''"
      class="whitespace-pre-wrap"
      >{{ json }}</pre
    >
  </div>
</template>

<style scoped></style>
