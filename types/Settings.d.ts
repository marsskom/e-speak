export interface Settings {
  recorder: AudioRecorderSettings;
}

interface AudioRecorderSettings {
  minDuration: number;
  maxDuration: number;
}
