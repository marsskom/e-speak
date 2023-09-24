import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { AudioFileFactory } from "~/models/Audio/AudioFileFactory";
import { getTranscription } from "~/server/utils/ai";

const config = useRuntimeConfig();

export default defineEventHandler(async (event): Promise<Transcription> => {
  const data: AudioTranscriptionRequest = await readBody(event);
  const audio: File = AudioFileFactory.base64ToAudio(
    data.fileBase64,
    data.mimeType,
  );

  let result: Transcription = {
    text: "Lorem Ipsum",
  } as Transcription;
  if (config.openAi.whisperEnabled) {
    result = await getTranscription(audio);
  }

  if (!result.text || result.text.length === 0) {
    throw new Error("Transcription failed");
  }

  return result;
});
