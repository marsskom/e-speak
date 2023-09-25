import { v4 as uuidv4 } from "uuid";
import { Transcription } from "openai/resources/audio";
import { ChatCompletion } from "openai/resources/chat/completions";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";
import { getKeyByValue } from "~/models/Enum";

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

  static createFromChatCompletion(chatCompletion: ChatCompletion): Message {
    const message = MessageFactory.createEmpty();
    message.chatCompletion = chatCompletion;

    const choice = chatCompletion.choices.filter(
      (choice) => choice?.message?.content?.length,
    )[0];

    message.role =
      getKeyByValue(OpenAIRole, choice.message.role)?.toLowerCase() ||
      OpenAIRole.System;
    message.content = choice.message.content || "";

    return message;
  }
}
