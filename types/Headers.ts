import { type AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory";

export default interface CustomHeaders {
  audioParams: AudioFileFactoryParams;
  dialogUid: string;
  messageUid: string;
  chatDriver: string;
  isDummyChatDriver: boolean;
}
