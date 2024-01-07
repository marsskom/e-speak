<script setup lang="ts">
import { type Message } from "~/types/Dialog/Message";
import PopupModal from "~/components/Page/PopupModal.vue";
import AudioPlayer from "~/components/Audio/AudioPlayer.vue";
import CopyLink from "~/components/Page/CopyLink.vue";
import PreJson from "~/components/Page/Text/PreJson.vue";
import { formatDateTime } from "~/utils/date";
import DialogMessageViewModel from "~/viewmodels/Dialog/DialogMessageViewModel";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const isAdvancedMode: ComputedRef<boolean> = useIsAdvancedMode();

const dialogMessageViewModel: DialogMessageViewModel =
  new DialogMessageViewModel(props.message);

const messagePopup: Ref<null | typeof PopupModal> = ref(null);

const togglePopupVisibility = () => {
  if (!messagePopup.value) {
    return;
  }

  messagePopup.value.toggleVisibility();
};
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
          <p
            v-if="!props.message.correctedContent.length"
            class="text-lg prose max-w-full"
          >
            {{ props.message.content }}
          </p>

          <p
            v-if="props.message.correctedContent.length"
            class="text-lg prose max-w-full"
          >
            <fa :icon="['fas', 'pencil-alt']" class="mr-2" />&nbsp;{{
              props.message.correctedContent
            }}
          </p>
          <p
            v-if="props.message.correctedContent.length"
            class="text-lg prose max-w-full mt-5 mb-3 text-gray-400 hover:text-gray-600"
          >
            {{ props.message.content }}
          </p>
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
        <PopupModal
          v-if="isAdvancedMode"
          ref="messagePopup"
          title="Message Details"
          width="max-w-4xl"
        >
          <template #button>
            <a
              href="#"
              class="inline-block"
              :class="
                dialogMessageViewModel.isUserMessage.value
                  ? 'text-pink-600'
                  : 'text-violet-500'
              "
              title="Message Information"
              @click="togglePopupVisibility"
            >
              <fa :icon="['fas', 'info-circle']" />
            </a>
          </template>

          <template #content>
            <div class="flex flex-col text-sm">
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">UID:</div>
                <div class="w-5/6 border px-4 py-2">
                  <CopyLink :content="props.message.uid" />&nbsp;{{
                    props.message.uid
                  }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Content:</div>
                <div class="w-5/6 border px-4 py-2">
                  {{ props.message.content }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Role:</div>
                <div class="w-5/6 border px-4 py-2">
                  {{ props.message.role }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Created At:</div>
                <div class="w-5/6 border px-4 py-2">
                  {{ formatDateTime(props.message.createdAt) }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Updated At:</div>
                <div class="w-5/6 border px-4 py-2">
                  {{ formatDateTime(props.message.updatedAt) }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Audio File:</div>
                <div class="w-5/6 border px-4 py-2">
                  <CopyLink :content="props.message.audioFile || ''" />&nbsp;
                  {{ props.message.audioFile || "" }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Chat Completion:</div>
                <div class="w-5/6 border px-4 py-2">
                  <PreJson :content="props.message.chatCompletion || ''" />
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Prompt:</div>
                <div class="w-5/6 border px-4 py-2">
                  <PreJson :content="props.message.promptList || ''" />
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">Corrected Content:</div>
                <div class="w-5/6 border px-4 py-2">
                  {{ props.message.correctedContent || "" }}
                </div>
              </div>
              <div class="flex flex-row flex-wrap">
                <div class="w-1/6 font-bold px-4 py-2">
                  Corrected Messages List:
                </div>
                <div class="w-5/6 border px-4 py-2">
                  <PreJson
                    :content="props.message.correctedMessageList || ''"
                  />
                </div>
              </div>
            </div>
          </template>
        </PopupModal>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
