<script setup lang="ts">
import { formatDateTime } from "~/utils/date";
import type { Message } from "~/types/Dialog/Message";
import PopupModal from "~/components/Page/PopupModal.vue";
import CopyLink from "~/components/Page/CopyLink.vue";
import PreJson from "~/components/Page/Text/PreJson.vue";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
  isUserMessage: {
    type: Boolean,
    default: false,
  },
});

const isAdvancedMode: ComputedRef<boolean> = useIsAdvancedMode();

const messagePopup: Ref<null | typeof PopupModal> = ref(null);

const togglePopupVisibility = () => {
  if (!messagePopup.value) {
    return;
  }

  messagePopup.value.toggleVisibility();
};
</script>

<template>
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
        :class="props.isUserMessage ? 'text-pink-600' : 'text-violet-500'"
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
          <div class="w-1/6 font-bold px-4 py-2">Corrected Messages List:</div>
          <div class="w-5/6 border px-4 py-2">
            <PreJson :content="props.message.correctedMessageList || ''" />
          </div>
        </div>
      </div>
    </template>
  </PopupModal>
</template>

<style scoped></style>
