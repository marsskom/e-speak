import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message } from "~/types/Dialog/Message.d";

export interface MessageFactory {
  createEmpty(): Message;
  createFromTranscription(
    data: AudioTranscriptionRequest,
    transcription: Transcription,
  ): Message;
}
