import { AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory.d";

export interface Settings {
  recorder: AudioRecorderSettings;
  chat: ChatSettings;
  advanced: AdvancedSettings;
}

export interface AudioRecorderSettings {
  minDuration: number;
  maxDuration: number;
  audioParams: AudioFileFactoryParams;
}

export interface ChatSettings {
  driver: ChatDriver;
}

export enum ChatDriver {
  Dummy = "dummy",
  OpenAI = "openai",
}

export interface AdvancedSettings {
  enabled: boolean;
}
