<script setup lang="ts">
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";
import AudioPlayer from "~/components/Audio/AudioPlayer.vue";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const avatar: ComputedRef<string> = computed((): string => {
  switch (props.message.role) {
    case OpenAIRole.User:
      return useGetUser().photoURL || "https://via.placeholder.com/32";
    case OpenAIRole.Assistant:
      return "https://via.placeholder.com/32";
    default:
      return "https://via.placeholder.com/32";
  }
});

const content: ComputedRef<string> = computed((): string => {
  return props.message.content;
});

const author: ComputedRef<string> = computed(() => {
  switch (props.message.role) {
    case OpenAIRole.User:
      return "You";
    case OpenAIRole.Assistant:
      return "Assistant";
    default:
      return "System";
  }
});

const isUserMessage: ComputedRef<boolean> = computed(() => {
  return props.message.role === OpenAIRole.User;
});
</script>

<template>
  <div
    class="flex items-center mb-4 w-4/6 my-5"
    :class="isUserMessage ? 'flex-row-reverse float-right' : ''"
  >
    <div
      class="flex-none flex flex-col items-center space-y-1"
      :class="isUserMessage ? 'ml-4' : 'mr-4'"
    >
      <img :src="avatar" :alt="author" class="w-10 h-10 rounded-full" />
      <span class="block text-xs">{{ author }}</span>
    </div>
    <div
      class="flex min-w-[20rem] p-2 rounded-lg mb-2 relative"
      :class="
        isUserMessage ? 'bg-pink-200 text-gray-800' : 'bg-pink-400 text-white'
      "
    >
      <div class="inline-block w-full px-2 py-2">
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="text-sm prose"
          :class="isUserMessage ? 'text-gray-800' : 'text-white'"
          v-html="content"
        ></p>
        <!--eslint-enable-->

        <hr
          v-if="isUserMessage; "
          class="border-b border-pink-300 mt-3 mb-1 rounded-full"
        />
        <div v-if=" isUserMessage; ">
          <AudioPlayer :message=" props.message; " />

          <span class="text-xs text-gray-500 float-right py-1">{{
            props.message.createdAt.toISOString()
          }}</span>
        </div>
      </div>

      <div
        v-if=" !isUserMessage; "
        class="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-pink-400"
      ></div>
      <div
        v-else
        class="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 bg-pink-200"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
