import { type ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { type Message } from "~/types/Dialog/Message";

export default class MessageTransform {
  public messageListToOpenAIMessageList(
    messageList: Message[],
  ): ChatCompletionMessageParam[] {
    return messageList.map(
      (message: Message) =>
        ({
          role: message.role,
          content: message.content,
        }) as ChatCompletionMessageParam,
    );
  }
}
