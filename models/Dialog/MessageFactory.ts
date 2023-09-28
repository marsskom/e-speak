import { v4 as uuidv4 } from "uuid";
import { Transcription } from "openai/resources/audio";
import { ChatCompletion } from "openai/resources/chat/completions";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { Message, OpenAIRole } from "~/types/Dialog/Message.d";
import { Prompt } from "~/types/Dialog/Prompt.d";

export default class MessageFactory {
  createEmpty(): Message {
    return {
      uid: uuidv4(),
      content: "",
      correctedContent: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Message;
  }

  fillWithTranscription(
    data: AudioTranscriptionRequest,
    transcription: Transcription,
    message?: Message,
  ): Message {
    if (!message) {
      message = this.createEmpty();
    }

    message.audioFile = data.filename;
    message.content = transcription.text;
    message.role = OpenAIRole.User;

    return message;
  }

  createFromChatCompletion(chatCompletion: ChatCompletion): Message {
    const message = this.createEmpty();
    message.chatCompletion = chatCompletion;

    const choice = chatCompletion.choices.filter(
      (choice) => choice?.message?.content?.length,
    )[0];

    message.role = choice.message.role.toLowerCase() || OpenAIRole.System;
    message.content = choice.message.content || "";

    return message;
  }

  createFromPrompts(prompts: Prompt[]): Message[] {
    return prompts.map((prompt: Prompt) => {
      const message = this.createEmpty();
      message.content = prompt.prompt;
      message.role = OpenAIRole.System;

      return message;
    });
  }
}
