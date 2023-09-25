import { Transcription } from "openai/resources/audio";

import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import { AudioFileFactory } from "~/models/Audio/AudioFileFactory";
import { getTranscription } from "~/server/utils/ai";

export default defineEventHandler(async (event): Promise<Transcription> => {
  const data: AudioTranscriptionRequest = await readBody(event);
  const audio: File = AudioFileFactory.base64ToAudio(
    data.fileBase64,
    data.mimeType,
  );

  // const result: Transcription = {
  //   text: "Let's talk about something interesting!",
  // } as Transcription;
  const result = await getTranscription(audio);

  if (!result.text || result.text.length === 0) {
    throw new Error("Transcription failed");
  }

  return result;
});
