import { ClientOptions, OpenAI } from "openai";
import { RequestOptions } from "openai/core";
import { Transcription } from "openai/resources/audio/transcriptions";
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

const config = useRuntimeConfig();
const clientOptions: ClientOptions = {
  apiKey: config.openAi.secretKey,
  organization: "Personal",
};
const openai = new OpenAI(clientOptions);

export const getChatStream = async (messages: ChatCompletionMessageParam[]) => {
  const params: ChatCompletionCreateParamsStreaming = {
    messages,
    model: "gpt-4",
    max_tokens: 2048,
    temperature: 0.7,
  } as ChatCompletionCreateParamsStreaming;

  const options: RequestOptions = {
    stream: true,
  } as RequestOptions;

  return await openai.chat.completions.create(params, options);
};

export const getTranscription = async (audio: File): Promise<Transcription> => {
  const formData = new FormData();
  formData.append("file", audio);
  formData.append("model", "whisper-1");
  formData.append("temperature", "0.5");
  formData.append("response_format", "json");

  const result = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openAi.secretKey}`,
    },
    body: formData,
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      return Promise.resolve(json as Transcription);
    });

  return result;
};
