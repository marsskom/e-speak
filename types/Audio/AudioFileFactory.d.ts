export interface AudioFileFactory {
  generateFileName(extension: string, prefix?: string): string;
  createAudioFile(audioBlob: Blob, mimeType: string): File;
}
