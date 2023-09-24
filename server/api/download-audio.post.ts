import {
  AudioDownloadRequest,
  AudioDownloadResponse,
} from "~/types/Api/Request.d";

export default defineEventHandler(
  async (event): Promise<AudioDownloadResponse> => {
    const data: AudioDownloadRequest = await readBody(event);

    return await fetch(data.filename)
      .then((response) => response.blob())
      .then(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        return {
          fileBase64:
            "data:audio/webm;base64," +
            Buffer.from(arrayBuffer).toString("base64"),
        } as AudioDownloadResponse;
      });
  },
);
