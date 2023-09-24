export interface AudioFileFactory {
  generateFileName(extension: string, prefix?: string): string;
  createAudioFile(audioBlob: Blob, mimeType: string): File;
  audioToBase64(audio: File): Promise<string>;
  base64ToAudio(base64: string, mimeType: string): File;
}

export interface AudioFileFactoryParams {
  filename?: string;
  prefix?: string;
  mimeType?: string;
}
