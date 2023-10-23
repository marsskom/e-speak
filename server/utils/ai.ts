import { type Transcription } from "openai/resources/audio/transcriptions";
import {
  type ChatCompletionCreateParamsStreaming,
  type ChatCompletionMessageParam,
  type ChatCompletion,
} from "openai/resources/chat/completions";

const config = useRuntimeConfig();

export const getChatStream = async (
  messages: ChatCompletionMessageParam[],
): Promise<ChatCompletion> => {
  const params: ChatCompletionCreateParamsStreaming = {
    messages,
    model: "gpt-4",
    max_tokens: 2048,
    temperature: 0.7,
  } as ChatCompletionCreateParamsStreaming;

  return await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openAi.secretKey}`,
    },
    body: JSON.stringify(params),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("An error occured while fetching OpenAI API");
      }

      return await response.json();
    })
    .then((json) => {
      return Promise.resolve(json as ChatCompletion);
    });
};

export const getTranscription = async (audio: File): Promise<Transcription> => {
  const formData = new FormData();
  formData.append("file", audio, audio.name);
  formData.append("model", "whisper-1");
  formData.append("temperature", "0.5");
  formData.append("response_format", "json");

  return await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openAi.secretKey}`,
    },
    body: formData,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("An error occured while fetching Whisper API");
      }

      return await response.json();
    })
    .then((json) => {
      return Promise.resolve(json as Transcription);
    });
};
