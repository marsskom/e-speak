import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message } from "~/types/Dialog/Message.d";

export interface MessageFactory {
  static createEmpty(): Message;
  static createFromTranscription(
    data: AudioTranscriptionRequest,
    transcription: Transcription,
  ): Message;
}
