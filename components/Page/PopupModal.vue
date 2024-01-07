<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "Modal title",
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "max-w-2xl",
  },
});

const isVisible: Ref<boolean> = ref(props.isVisible);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closePopup = (event: MouseEvent) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  isVisible.value = false;
};

defineExpose({
  toggleVisibility,
});
</script>

<template>
  <div class="w-auto">
    <slot name="button">
      <button
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        @click="toggleVisibility"
      >
        Toggle modal
      </button>
    </slot>

    <div
      v-if="isVisible"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-10 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 transition-opacity flex items-center justify-center modal-background"
      @click="closePopup"
    >
      <div class="relative w-full max-h-full" :class="props.width">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div class="p-4 border-b rounded-t dark:border-gray-600">
            <slot name="header">
              <div class="flex items-center justify-between">
                <h2
                  class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                  {{ props.title }}
                </h2>
                <a href="#">
                  <fa
                    :icon="['fas', 'times']"
                    class="text-red-600 text-xl float-right right-0"
                    @click="toggleVisibility"
                  />
                </a>
              </div>
            </slot>
          </div>

          <div class="p-6 space-y-6">
            <slot name="content">
              <p class="text-gray-700 dark:text-gray-400">Modal Content</p>
            </slot>
          </div>

          <div
            class="flex w-full p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 justify-between items-center"
          >
            <slot name="footer">
              <button
                type="button"
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 float-right flex-1"
                @click="toggleVisibility"
              >
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
