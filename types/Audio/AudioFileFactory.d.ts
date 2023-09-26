export interface AudioFileFactory {
  generateFileName(extension: string, prefix: string = ""): string;
  createAudioFile(audioBlob: Blob, filename?: string): File;
  audioToBase64(audio: File): Promise<string>;
  base64ToAudio(base64: string): File;
}

export interface AudioFileFactoryParams {
  prefix?: string;
  mimeType?: string;
}
