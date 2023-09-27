export enum AudioRecorderState {
  Idle = "Idle",
  Recording = "Recording",
}

export declare interface AudioRecorder {
  start(): Promise<MediaStream>;
  stop(): Promise<void | Blob>;
  cancel(): void;
  getErrorMessage(error: Error): string;
}
