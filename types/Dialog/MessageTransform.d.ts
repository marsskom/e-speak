import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export declare interface MessageTransform {
  messageListToOpenAIMessageList(
    messageList: Message[],
  ): ChatCompletionMessageParam[];
}
