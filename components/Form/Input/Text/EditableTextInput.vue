<script setup lang="ts">
import { type EventChange } from "~/types/Form/Text/TextInput";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "change", value: EventChange): void;
}>();

const editInput = ref(null);
const inputText: Ref<string> = ref(props.text);
const isEditing: Ref<boolean> = ref(false);

const toggleEditing = () => {
  isEditing.value = !isEditing.value;

  if (isEditing.value) {
    nextTick(() => {
      if (editInput.value !== null) {
        editInput.value.focus();
      }
    });
  }
};

const save = () => {
  toggleEditing();

  emit("change", {
    value: inputText.value,
  } as EventChange);
};

watch(
  () => props.text,
  (text) => {
    inputText.value = text;
  },
);
</script>

<template>
  <div>
    <fa
      v-if="isEditing"
      :icon="['fas', 'floppy-disk']"
      class="mr-2 text-sm text-green-600"
      title="Save changes"
      @click="save"
    ></fa>

    <fa
      v-if="!isEditing"
      :icon="['fas', 'edit']"
      class="mr-2 text-sm text-blue-600"
      title="Edit value"
      @click="toggleEditing"
    ></fa>

    <div v-if="!isEditing" class="inline-block">
      <slot>
        <div>
          <span class="text-xl font-bold text-gray-800">
            {{ inputText }}
          </span>
        </div>
      </slot>
    </div>

    <div v-if="isEditing" class="inline-block">
      <input
        ref="editInput"
        v-model="inputText"
        type="text"
        class="w-full px-3 py-1 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        @keyup.enter="save"
        @keyup.escape="toggleEditing"
      />
    </div>

    <fa
      v-if="isEditing"
      :icon="['fas', 'times']"
      class="ml-2 text-lg text-red-600"
      title="Cancel editing"
      @click="
        inputText = props.text;
        toggleEditing();
      "
    ></fa>
  </div>
</template>

<style scoped></style>
