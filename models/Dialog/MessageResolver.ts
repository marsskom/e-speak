import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";

import MessageTransform from "~/models/Dialog/MessageTransform";
import MessageFactory from "~/models/Dialog/MessageFactory";

import { useDialogStore } from "~/stores/Dialog/dialog";

export default class MessageResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor(private messageList: Message[]) {}

  askOpenAI(): Promise<void> {
    if (!this.messageList || this.messageList.length === 0) {
      return Promise.resolve();
    }

    if (!this.verifyUserOfLastMessage()) {
      return Promise.resolve();
    }

    const openAIMessageList = this.mutateLastMessagePrompt(
      MessageTransform.messageListToOpenAIMessageList(this.messageList),
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
        const { addMessage } = useDialogStore();
        addMessage(MessageFactory.createFromChatCompletion(chatCompletion));

        return Promise.resolve();
      });
  }

  private verifyUserOfLastMessage(): boolean {
    const lastMessage = this.messageList[this.messageList.length - 1];

    return lastMessage.role === OpenAIRole.User;
  }

  private mutateLastMessagePrompt(
    messages: ChatCompletionMessageParam[],
  ): ChatCompletionMessageParam[] {
    const lastMessage = messages[messages.length - 1];

    lastMessage.content =
      "Answer should be embedded in html tags. " + lastMessage.content;

    messages[messages.length - 1] = lastMessage;

    return messages;
  }
}
