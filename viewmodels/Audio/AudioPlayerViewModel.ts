import type {
  AudioDownloadRequest,
  AudioDownloadResponse,
} from "~/types/Api/Request";

export default class AudioPlayerViewModel {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly audioFileUrl: null | undefined | string) {}

  async downloadAudio(): Promise<string> {
    if (!this.audioFileUrl || !this.audioFileUrl.length) {
      throw new Error("No audio file URL provided.");
    }

    const response = await fetch("/api/download-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: this.audioFileUrl,
      } as AudioDownloadRequest),
    });
    if (!response.ok) {
      throw new Error("An error occurred while fetching the audio file.");
    }
    const result: AudioDownloadResponse =
      (await response.json()) as AudioDownloadResponse;
    return result.fileBase64;
  }
}
