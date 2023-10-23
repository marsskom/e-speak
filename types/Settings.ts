import { type AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory";
import { type Prompt } from "~/types/Dialog/Prompt";

export enum ChatDriver {
  Dummy = "dummy",
  OpenAI = "openai",
}

export interface ChatSettings {
  driver: ChatDriver;
}

export interface AdvancedSettings {
  enabled: boolean;
}

export interface AudioRecorderSettings {
  minDuration: number;
  maxDuration: number;
  audioParams: AudioFileFactoryParams;
}

export interface Settings {
  recorder: AudioRecorderSettings;
  chat: ChatSettings;
  advanced: AdvancedSettings;
  promptList: Prompt[];
  updatedAt?: Date;
}
