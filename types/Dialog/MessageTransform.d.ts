import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export default interface MessageTransform {
  messageListToOpenAIMessageList(
    messageList: Message[],
  ): ChatCompletionMessageParam[];
}
