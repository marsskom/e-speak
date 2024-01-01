import { type ChatCompletion } from "openai/resources/chat/completions";

import { type Message, OpenAIRole } from "~/types/Dialog/Message";
import { type Prompt } from "~/types/Dialog/Prompt";
import MessageTransform from "~/models/Dialog/MessageTransform";
import MessageFactory from "~/models/Dialog/MessageFactory";
import { usePromptStore } from "~/stores/Dialog/prompt";

export default class MessageCorrector {
  private messageFactory: MessageFactory = new MessageFactory();

  constructor(private message: Message) { }

  correctMessage(): Promise<String> {
    if (
      this.message.role !== OpenAIRole.User
      || 0 < this.message.correctedContent.length
      || 0 === this.message.content.length
    ) {
      return Promise.resolve("");
    }

    const messageList = this.mutateWithPrompts();
    messageList.push(this.message);

    const openAIMessageList =
      new MessageTransform().messageListToOpenAIMessageList(messageList);

    return fetch('/api/correction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...useHeaders(),
      },
      body: JSON.stringify({ messages: openAIMessageList }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('An error occured while fetching the answer.');
        }

        return await response.json();
      })
      .then((chatCompletion: ChatCompletion) => {
        const message =
          this.messageFactory.createFromChatCompletion(chatCompletion);
        message.content = message.content.replace(/\\n/g, '<br />');

        return message.content;
      });
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
    return usePromptStore().promptsOnMessageCorrect;
  }
}
