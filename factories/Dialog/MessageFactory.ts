import { v4 as uuidv4 } from "uuid";
import { type Transcription } from "openai/resources/audio";
import { type ChatCompletion } from "openai/resources/chat/completions";

import { type AudioTranscriptionRequest } from "~/types/Api/Request";
import { type Message, OpenAIRole } from "~/types/Dialog/Message";
import { type Prompt } from "~/types/Dialog/Prompt";

export default class MessageFactory {
  public createEmpty(): Message {
    return {
      uid: uuidv4(),
      content: "",
      correctedContent: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Message;
  }

  public fillWithTranscription(
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

  public createFromChatCompletion(chatCompletion: ChatCompletion): Message {
    const message = this.createEmpty();
    message.chatCompletion = chatCompletion;

    const choice = chatCompletion.choices.filter(
      (choice) => choice?.message?.content?.length,
    )[0];

    message.role = choice.message.role.toLowerCase() || OpenAIRole.System;
    message.content = choice.message.content || "";

    return message;
  }

  public createFromPrompts(prompts: Prompt[]): Message[] {
    return prompts.map((prompt: Prompt) => {
      const message = this.createEmpty();
      message.content = prompt.prompt;
      message.role = OpenAIRole.System;

      return message;
    });
  }
}
