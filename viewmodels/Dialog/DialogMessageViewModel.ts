import type { ComputedRef } from "vue";

import type { Message } from "~/types/Dialog/Message";
import { OpenAIRole } from "~/types/Dialog/Message";
import MessageCorrector from "~/models/Dialog/MessageCorrector";
import { useDialogStore } from "~/stores/Dialog/dialog";

const dialogStore = useDialogStore();
const { updateMessage } = dialogStore;

export default class DialogMessageViewModel {
  private isCorrectionInProgressValue: Ref<boolean> = ref(false);

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly message: Message) {}

  public get avatar(): ComputedRef<string> {
    return computed((): string => {
      switch (this.message.role) {
        case OpenAIRole.User:
          return useGetUser().photoURL || "https://via.placeholder.com/32";
        default:
          return "https://via.placeholder.com/32";
      }
    });
  }

  public get author(): ComputedRef<string> {
    return computed((): string => {
      switch (this.message.role) {
        case OpenAIRole.User:
          return "You";
        case OpenAIRole.Assistant:
          return "Assistant";
        default:
          return "System";
      }
    });
  }

  public get isUserMessage(): ComputedRef<boolean> {
    return computed((): boolean => {
      return this.message.role === OpenAIRole.User;
    });
  }

  public get isSystemMessage(): ComputedRef<boolean> {
    return computed((): boolean => {
      return this.message.role === OpenAIRole.System;
    });
  }

  public get isCorrectionInProgress(): ComputedRef<boolean> {
    return computed((): boolean => {
      return this.isCorrectionInProgressValue.value;
    });
  }

  public correctMessage() {
    if (
      this.isCorrectionInProgressValue.value ||
      !this.isUserMessage.value ||
      this.message.correctedContent.length > 0
    ) {
      return;
    }

    this.isCorrectionInProgressValue.value = true;

    const messageCorrector = new MessageCorrector(this.message);

    messageCorrector
      .correctMessage()
      .then((correctedMessage: Message) => {
        if (this.message.uid === correctedMessage.uid) {
          return;
        }

        const message: Message = this.message;
        message.correctedContent = correctedMessage.content;
        message.correctedMessageList = correctedMessage.correctedMessageList;

        updateMessage(message);
      })
      .finally(() => {
        this.isCorrectionInProgressValue.value = false;
      });
  }
}
