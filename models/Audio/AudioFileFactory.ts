import { AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory.d";

export class AudioFileFactory {
  static generateFileName(extension: string, prefix: string = ""): string {
    const date = new Date();
    const dayString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return `${prefix}${dayString}_${date
      .getHours()
      .toString()
      .padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${extension}`;
  }

  static createAudioFile(
    audioBlob: Blob,
    params: AudioFileFactoryParams = {} as AudioFileFactoryParams,
  ): File {
    params.mimeType = params.mimeType || "audio/webm";
    params.prefix = params.prefix || "audio_";

    const fileName =
      params.filename ||
      AudioFileFactory.generateFileName(
        params.mimeType.split("/")[1],
        params.prefix,
      );

    return new File([audioBlob], fileName, { type: params.mimeType });
  }

  static audioToBase64(audio: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audio);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  static base64ToAudio(base64: string, mimeType: string): File {
    const byteCharacters = atob(base64.split(",")[1]); // remove data:audio/webm;base64,
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

    return AudioFileFactory.createAudioFile(blob, { mimeType });
  }
}
