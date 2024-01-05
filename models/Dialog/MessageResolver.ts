import { type ChatCompletion } from "openai/resources/chat/completions";

import { type Message, OpenAIRole } from "~/types/Dialog/Message";
import { PrompType, type Prompt } from "~/types/Dialog/Prompt";
import MessageTransform from "~/models/Dialog/MessageTransform";
import MessageFactory from "~/models/Dialog/MessageFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";
import { useDialogStore } from "~/stores/Dialog/dialog";
import { type Dialog } from "~/types/Dialog/Dialog";

export default class MessageResolver {
  private messageFactory: MessageFactory = new MessageFactory();

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private dialogUid: string,
    private messageList: Message[],
  ) {}

  askOpenAI(): Promise<Message[]> {
    if (!this.messageList || this.messageList.length === 0) {
      return Promise.resolve([]);
    }

    // TODO: maybe sometimes bot can send a couple messages in a row.
    if (!this.verifyUserOfLastMessage()) {
      return Promise.reject(new Error("Last message was not from user."));
    }

    this.messageList.push(...this.mutateWithPrompts());

    const openAIMessageList =
      new MessageTransform().messageListToOpenAIMessageList(this.messageList);

    return fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...useHeaders(),
      },
      body: JSON.stringify({ messages: openAIMessageList }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("An error occured while fetching the answer.");
        }

        return await response.json();
      })
      .then((chatCompletion: ChatCompletion) => {
        const date = new Date();
        date.setMilliseconds(
          date.getMilliseconds() + (this.getPrompts().length + 5),
        );

        const message =
          this.messageFactory.createFromChatCompletion(chatCompletion);
        message.createdAt = date;
        message.content = message.content.replace(/\\n/g, "<br />");
        message.dialogUid = this.dialogUid;
        message.promptList = this.getPrompts();

        this.messageList.push(message);

        return Promise.resolve(this.messageList);
      });
  }

  private verifyUserOfLastMessage(): boolean {
    const lastMessage = this.messageList[this.messageList.length - 1];

    return lastMessage.role === OpenAIRole.User;
  }

  private mutateWithPrompts(): Message[] {
    return this.messageFactory
      .createFromPrompts(this.getPrompts())
      .map((message: Message, index: number): Message => {
        const date = new Date();
        date.setMilliseconds(date.getMilliseconds() + (index + 2));

        return Object.assign(message, {
          dialogUid: this.dialogUid,
          createdAt: date,
        });
      });
  }

  private getPrompts(): Prompt[] {
    const dialogStore = useDialogStore();
    const currentDialog: ComputedRef<Dialog> = computed(() => {
      return dialogStore.currentDialog;
    });

    if (this.messageList.length <= 1) {
      const dialogPromptList = usePromptStore().filter(
        PrompType.StartDialog,
        currentDialog.value.promptList,
      );

      return dialogPromptList.length
        ? dialogPromptList
        : usePromptStore().promptsOnDialogStart;
    }

    const dialogPromptList = usePromptStore().filter(
      PrompType.ContinueDialog,
      currentDialog.value.promptList,
    );

    return dialogPromptList.length
      ? dialogPromptList
      : usePromptStore().promptsOnDialogContinue;
  }
}
