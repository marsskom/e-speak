import { v4 as uuidv4 } from "uuid";
import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";

export default class MessageFactory {
  static createEmpty(): Message {
    return {
      uid: uuidv4(),
      content: "",
      correctedContent: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Message;
  }

  static createFromTranscription(
    data: AudioTranscriptionRequest,
    transcription: Transcription,
  ): Message {
    const message = MessageFactory.createEmpty();
    message.audioFile = data.filename;
    message.content = transcription.text;
    message.role = OpenAIRole.User;

    return message;
  }
}
