import { ChatCompletion } from "openai/resources/chat/completions";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";

import MessageTransform from "~/models/Dialog/MessageTransform";
import MessageFactory from "~/models/Dialog/MessageFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";

export default class MessageResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private messageList: Message[]) {}

  askOpenAI(): Promise<Message[]> {
    if (!this.messageList || this.messageList.length === 0) {
      return Promise.resolve(this.messageList);
    }

    // TODO: maybe sometimes bot can send a couple messages in a row.
    if (!this.verifyUserOfLastMessage()) {
      return Promise.resolve(this.messageList);
    }

    this.messageList.push(...this.mutateWithPrompts());

    const openAIMessageList = MessageTransform.messageListToOpenAIMessageList(
      this.messageList,
    );

    return fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        const message = MessageFactory.createFromChatCompletion(chatCompletion);
        message.content = message.content.replace(/\\n/g, "<br />");

        this.messageList.push(message);

        return Promise.resolve(this.messageList);
      });
  }

  private verifyUserOfLastMessage(): boolean {
    const lastMessage = this.messageList[this.messageList.length - 1];

    return lastMessage.role === OpenAIRole.User;
  }

  private mutateWithPrompts(): Message[] {
    return MessageFactory.createFromPrompts(
      this.messageList.length <= 1
        ? usePromptStore().promptsOnDialogStart
        : usePromptStore().promptsOnDialogContinue,
    );
  }
}
