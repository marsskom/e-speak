import { type ChatCompletion } from "openai/resources/chat/completions";

import { type Message, OpenAIRole } from "~/types/Dialog/Message";
import { type Prompt, PrompType } from "~/types/Dialog/Prompt";
import MessageTransform from "~/models/Dialog/MessageTransform";
import MessageFactory from "~/models/Dialog/MessageFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";
import { useDialogStore } from "~/stores/Dialog/dialog";
import { type Dialog } from "~/types/Dialog/Dialog";

export default class MessageCorrector {
  private messageFactory: MessageFactory = new MessageFactory();

  // eslint-disable-next-line no-useless-constructor
  constructor(private message: Message) {}

  public async correctMessage(): Promise<Message> {
    if (
      this.message.role !== OpenAIRole.User ||
      this.message.correctedContent.length > 0 ||
      this.message.content.length === 0
    ) {
      return this.message;
    }

    const messageList: Message[] = this.mutateWithPrompts();
    messageList.push(this.message);

    const openAIMessageList =
      new MessageTransform().messageListToOpenAIMessageList(messageList);

    const response: Response = await fetch("/api/correction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...useHeaders(),
      },
      body: JSON.stringify({ messages: openAIMessageList }),
    });

    if (!response.ok) {
      throw new Error("An error occured while fetching the answer.");
    }

    const chatCompletion: ChatCompletion = await response.json();
    const message =
      this.messageFactory.createFromChatCompletion(chatCompletion);
    message.content = message.content.replace(/\\n/g, "<br />");

    messageList.pop();
    message.correctedMessageList = messageList;

    return message;
  }

  private mutateWithPrompts(): Message[] {
    return this.messageFactory
      .createFromPrompts(this.getPrompts())
      .map((message: Message, index: number): Message => {
        const date = new Date();
        date.setMilliseconds(date.getMilliseconds() + (index + 2));

        return Object.assign(message, {
          dialogUid: this.message.dialogUid,
          createdAt: date,
        });
      });
  }

  private getPrompts(): Prompt[] {
    const dialogStore = useDialogStore();
    const currentDialog: ComputedRef<Dialog> = computed(() => {
      return dialogStore.currentDialog;
    });

    const dialogPromptList = usePromptStore().filter(
      PrompType.CorrectMessage,
      currentDialog.value.promptList,
    );

    return dialogPromptList.length
      ? dialogPromptList
      : usePromptStore().promptsOnMessageCorrect;
  }
}
