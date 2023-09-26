import { AudioFileFactoryParams } from "~/types/Audio/AudioFileFactory.d";

export default interface CustomHeaders {
  audioParams: AudioFileFactoryParams;
  dialogUid: string;
  messageUid: string;
  chatDriver: string;
  isDummyChatDriver: boolean;
}
