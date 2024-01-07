import { type AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory";

export default class AudioFileFactory {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly params: AudioFileFactoryParams,
    private readonly dialogUid: string,
    private readonly messageUid: string,
  ) {}

  public generateFileName(extension: string, prefix: string = ""): string {
    const date = new Date();
    const dayString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    prefix = prefix
      .replace("%date%", dayString)
      .replace("%dialog_uid%", this.dialogUid)
      .replace("%message_uid%", this.messageUid);

    return `${prefix}-${dayString}_${date
      .getHours()
      .toString()
      .padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${extension}`;
  }

  public createAudioFile(audioBlob: Blob, filename?: string): File {
    const mimeType = this.params.mimeType;
    const prefix = this.params.prefix;

    const fileName =
      filename || this.generateFileName(mimeType!.split("/")[1], prefix);

    return new File([audioBlob], fileName, { type: mimeType });
  }

  public audioToBase64(audio: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audio);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public base64ToAudioBlob(base64: string): Blob {
    const byteCharacters = atob(base64.split(",")[1]); // remove data:audio/webm;base64,
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArrays)], {
      type: this.params.mimeType,
    });
  }
}
