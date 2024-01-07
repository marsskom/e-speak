import { ref as storageRef } from "firebase/storage";

import type { AudioTranscriptionRequest } from "~/types/Api/Request";
import type { Settings } from "~/types/Settings";
import { useAudioRecorderStore } from "~/stores/Audio/recorder";
import { useDialogListStore } from "~/stores/Dialog/dialogList";
import { useDialogStore } from "~/stores/Dialog/dialog";
import AudioFileFactory from "~/models/Audio/AudioFileFactory";
import MessageFactory from "~/models/Dialog/MessageFactory";

const settings: Settings = useGetSettings();

const dialogListStore = useDialogListStore();
const { refresh: refreshDialogList } = dialogListStore;

const dialogStore = useDialogStore();
const { addMessage } = dialogStore;

const audioRecorderStore = useAudioRecorderStore();
const {
  activate: setRecorderCanBeActivated,
  deactivate: setRecorderCannotBeActivated,
} = audioRecorderStore;

export default class AudioUploaderViewModel {
  private readonly audioFactory: AudioFileFactory = new AudioFileFactory(
    settings.recorder.audioParams,
    dialogStore.currentDialog.uid,
    dialogStore.currentMessageInProgress.uid,
  );

  public async upload(audioAsBlob: Blob): Promise<void> {
    if (!audioAsBlob) {
      return Promise.reject(new Error("Audio blob is not defined."));
    }

    setRecorderCannotBeActivated();

    const audio: File = this.audioFactory.createAudioFile(audioAsBlob);

    const user = useGetUser();
    const storage = useFirebaseStorage();
    const fileFullPath = `user/${user.uid}/audio/${audio.name}`;
    const audioFileRef = storageRef(storage, fileFullPath);
    const { upload } = useStorageFile(audioFileRef);
    const messageFactory: MessageFactory = new MessageFactory();
    let audioTranscriptionRequestData: AudioTranscriptionRequest;

    try {
      await upload(audio);
      audioTranscriptionRequestData = {
        filename: fileFullPath,
        fileBase64: await this.audioFactory.audioToBase64(audio),
      } as AudioTranscriptionRequest;

      const response: Response = await fetch("/api/transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...useHeaders(),
        },
        body: JSON.stringify(audioTranscriptionRequestData),
      });
      if (!response.ok) {
        throw new Error("An error occured while fetching the transcription.");
      }

      const transcription: any = await response.json();
      addMessage(
        messageFactory.fillWithTranscription(
          audioTranscriptionRequestData,
          transcription,
          dialogStore.currentMessageInProgress,
        ),
      ).finally(() => {
        setRecorderCanBeActivated();
      });

      return refreshDialogList();
    } catch (error) {
      setRecorderCanBeActivated();

      throw error;
    }
  }
}
