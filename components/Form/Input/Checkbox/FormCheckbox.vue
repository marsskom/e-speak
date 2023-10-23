<script setup lang="ts">
import { type EventChange, type Props } from "~/types/Form/Input/Checkbox";

const props = withDefaults(defineProps<Props>(), {
  id: "",
  value: 1,
  checked: false,
  disabled: false,
  required: false,
});

const isChecked: Ref<boolean> = ref(props.checked);

const emit = defineEmits<{
  (e: "change", value: EventChange): void;
}>();

watch(isChecked, (isChecked) => {
  emit("change", {
    isChecked,
    value: props.value,
  } as EventChange);
});
</script>

<template>
  <div class="flex items-center">
    <input
      :id="props.id"
      v-model="isChecked"
      :checked="isChecked"
      type="checkbox"
      :value="props.value"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      :disabled="props.disabled"
      :required="props.required"
    />
    <label
      :for="props.id"
      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >
      <slot></slot>
    </label>
  </div>
</template>

<style scoped></style>
