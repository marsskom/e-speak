export interface AudioFileFactory {
  static generateFileName(extension: string, prefix?: string): string;
  static createAudioFile(audioBlob: Blob, mimeType: string): File;
  static audioToBase64(audio: File): Promise<string>;
  static base64ToAudio(base64: string, mimeType: string): File;
}

export interface AudioFileFactoryParams {
  filename?: string;
  prefix?: string;
  mimeType?: string;
}
