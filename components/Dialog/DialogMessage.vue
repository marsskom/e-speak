<script setup lang="ts">
import { formatDateTime } from "~/utils/date";
import { type Message } from "~/types/Dialog/Message";
import AudioPlayer from "~/components/Audio/AudioPlayer.vue";
import DialogMessagePopupDetails from "~/components/Dialog/DialogMessage/DialogMessagePopupDetails.vue";
import DialogMessageViewModel from "~/viewmodels/Dialog/DialogMessageViewModel";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const dialogMessageViewModel: DialogMessageViewModel =
  new DialogMessageViewModel(props.message);
</script>

<template>
  <section
    v-if="dialogMessageViewModel.isSystemMessage.value"
    class="flex w-full bg-gray-200 rounded-xl mb-1"
  >
    <div
      class="flex flex-col w-1/12 border-r-gray-600 border-r m-2 items-center justify-center p-3"
    >
      <div class="w-full flex items-center justify-center">
        <div
          class="w-[36px] h-[36px] relative p-1 rounded-xl text-white flex items-center justify-center bg-gray-400"
          :title="dialogMessageViewModel.author.value"
        >
          <fa
            :icon="['fas', 'traffic-light']"
            :title="dialogMessageViewModel.author.value"
            class="text-center"
          />
        </div>
      </div>
      <p class="text-gray-600 font-600">{{ dialogMessageViewModel.author }}</p>
    </div>
    <div class="w-11/12 m-2">
      <p class="text-xs text-gray-500 mb-2">
        {{ formatDateTime(props.message.createdAt) }}
      </p>
      <p class="text-gray-600">{{ props.message.content }}</p>
    </div>
  </section>

  <section
    v-if="!dialogMessageViewModel.isSystemMessage.value"
    class="flex w-full rounded-xl mb-4"
    :class="
      dialogMessageViewModel.isUserMessage.value
        ? 'flex-row-reverse bg-pink-200'
        : 'bg-violet-200'
    "
  >
    <div
      class="flex flex-col w-1/12 m-2 items-center justify-center p-3"
      :class="
        dialogMessageViewModel.isUserMessage.value
          ? 'border-l-pink-600 border-l'
          : 'border-r-violet-600 border-r'
      "
    >
      <div class="w-full flex items-center justify-center">
        <img
          v-if="dialogMessageViewModel.isUserMessage.value"
          :src="dialogMessageViewModel.avatar.value"
          :alt="dialogMessageViewModel.author.value"
          :title="dialogMessageViewModel.author.value"
          class="w-10 h-10 rounded-full"
        />
        <div
          v-else
          class="w-[36px] h-[36px] relative p-1 rounded-xl text-white flex items-center justify-center bg-green-500"
          :title="dialogMessageViewModel.author.value"
        >
          <fa
            :icon="['fas', 'robot']"
            :title="dialogMessageViewModel.author.value"
            class="text-center"
          />
        </div>
      </div>
      <p
        class="font-800"
        :class="
          dialogMessageViewModel.isUserMessage.value
            ? 'text-pink-600'
            : 'text-violet-600'
        "
      >
        {{ dialogMessageViewModel.author }}
      </p>
    </div>
    <div
      class="w-11/12 m-2"
      :class="dialogMessageViewModel.isUserMessage.value ? 'pl-4' : ''"
    >
      <p class="text-xs text-gray-500 mb-2">
        {{ formatDateTime(props.message.createdAt) }}
      </p>
      <div class="flex w-full items-center justify-center">
        <div class="w-full m-5">
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-if="!props.message.correctedContent.length"
            class="text-lg prose max-w-full"
            v-html="props.message.content"
          ></p>

          <p
            v-if="props.message.correctedContent.length"
            class="text-lg prose max-w-full"
          >
            <fa
              :icon="['fas', 'pencil-alt']"
              class="mr-2"
              title="Corrected Message"
            />&nbsp;<span v-html="props.message.correctedContent"></span>
          </p>
          <p
            v-if="props.message.correctedContent.length"
            class="text-lg prose max-w-full mt-5 mb-3 text-gray-400 hover:text-gray-600"
            v-html="props.message.content"
          ></p>
          <!--eslint-enable-->
        </div>
      </div>
      <div
        class="flex border-t pt-4 text-lg justify-end"
        :class="
          dialogMessageViewModel.isUserMessage.value
            ? 'border-t-pink-300'
            : 'border-t-violet-300'
        "
      >
        <AudioPlayer
          v-if="dialogMessageViewModel.isUserMessage.value"
          :message="props.message"
        >
          <fa
            :icon="['fas', 'ear-listen']"
            title="Listen original audio"
            class="text-pink-600"
          />
        </AudioPlayer>

        <a
          v-if="dialogMessageViewModel.isUserMessage.value"
          href="#"
          class="inline-block float-right mx-4"
          :class="
            props.message.correctedContent.length > 0
              ? 'text-gray-500'
              : 'text-pink-600'
          "
          title="Text Corrections"
          @click="dialogMessageViewModel.correctMessage"
        >
          <fa
            v-if="!dialogMessageViewModel.isCorrectionInProgress.value"
            :icon="['fas', 'pencil-alt']"
          />
          <fa v-else :icon="['fas', 'spinner']" spin />
        </a>

        <DialogMessagePopupDetails
          v-if="useIsAdvancedMode()"
          :message="props.message"
          :is-user-message="dialogMessageViewModel.isUserMessage.value"
        />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
