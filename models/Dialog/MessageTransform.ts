import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { Message } from "~/types/Dialog/Message.d";

export default class MessageTransform {
  static messageListToOpenAIMessageList(
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
