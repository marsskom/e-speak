export interface AudioTranscriptionRequest {
  filename: string;
  fileBase64: string;
}

export interface AudioDownloadRequest {
  filename: string;
}

export interface AudioDownloadResponse {
  fileBase64: string;
}
