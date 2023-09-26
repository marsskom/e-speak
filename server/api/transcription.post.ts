import { Transcription } from "openai/resources/audio";

import CustomHeaders from "~/types/Headers.d";
import { AudioTranscriptionRequest } from "~/types/Api/Request.d";
import AudioFileFactory from "~/models/Audio/AudioFileFactory";
import { getTranscription } from "~/server/utils/ai";
import useHeaders from "~/server/utils/headers";

export default defineEventHandler(async (event): Promise<Transcription> => {
  const data: AudioTranscriptionRequest = await readBody(event);
  const customHeaders: CustomHeaders = useHeaders(event.headers);

  const audioFileFactory = new AudioFileFactory(
    customHeaders.audioParams,
    customHeaders.dialogUid,
    customHeaders.messageUid,
  );
  const audio: File = audioFileFactory.base64ToAudio(data.fileBase64);

  let result: Transcription;
  if (customHeaders.isDummyChatDriver) {
    result = {
      text: "Dummy: Let's have a conversation about something interesting!",
    } as Transcription;
  } else {
    result = await getTranscription(audio);
  }

  if (!result.text || result.text.length === 0) {
    throw new Error("Transcription failed");
  }

  return result;
});
