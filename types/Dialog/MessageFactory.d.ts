import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message } from "~/types/Dialog/Message.d";

export interface MessageFactory {
  createEmpty(): Message;
  fillWithTranscription(
    data: AudioTranscriptionRequest,
    transcription: Transcription,
    message?: Message,
  ): Message;
  createFromChatCompletion(chatCompletion: ChatCompletion): Message;
  createFromPrompts(prompts: Prompt[]): Message[];
}
