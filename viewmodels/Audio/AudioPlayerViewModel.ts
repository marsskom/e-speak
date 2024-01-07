import type {
  AudioDownloadRequest,
  AudioDownloadResponse,
} from "~/types/Api/Request";

export default class AudioPlayerViewModel {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly audioFileUrl: null | undefined | string) {}

  downloadAudio(): Promise<string> {
    if (!this.audioFileUrl || !this.audioFileUrl.length) {
      throw new Error("No audio file URL provided.");
    }

    return fetch("/api/download-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: this.audioFileUrl,
      } as AudioDownloadRequest),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("An error occurred while fetching the audio file.");
        }

        return await response.json();
      })
      .then((result: AudioDownloadResponse) => {
        return result.fileBase64;
      });
  }
}
