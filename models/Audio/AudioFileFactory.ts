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

  static createAudioFile(audioBlob: Blob, mimeType: string): File {
    const fileName = AudioFileFactory.generateFileName("webm", "audio_");

    return new File([audioBlob], fileName, { type: mimeType });
  }
}
