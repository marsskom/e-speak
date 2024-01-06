import { ref as storageRef } from "firebase/storage";
import type { Transcription } from "openai/resources/audio";

import type { Settings } from "~/types/Settings";
import AudioFileFactory from "~/models/Audio/AudioFileFactory";
import { useAudioRecorderStore } from "~/stores/Audio/recorder";
import { useDialogListStore } from "~/stores/Dialog/dialogList";
import { useDialogStore } from "~/stores/Dialog/dialog";
import MessageFactory from "~/models/Dialog/MessageFactory";
import type { AudioTranscriptionRequest } from "~/types/Api/Request";

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
  #audioFactory: AudioFileFactory = new AudioFileFactory(
    settings.recorder.audioParams,
    dialogStore.currentDialog.uid,
    dialogStore.currentMessageInProgress.uid,
  );

  upload(audioAsBlob: Blob): Promise<void> {
    if (!audioAsBlob) {
      return Promise.reject(new Error("Audio blob is not defined."));
    }

    setRecorderCannotBeActivated();

    const audio: File = this.#audioFactory.createAudioFile(audioAsBlob);

    const user = useGetUser();
    const storage = useFirebaseStorage();
    const fileFullPath = `user/${user.uid}/audio/${audio.name}`;
    const audioFileRef = storageRef(storage, fileFullPath);
    const { upload } = useStorageFile(audioFileRef);
    const messageFactory: MessageFactory = new MessageFactory();
    let audioTranscriptionRequestData: AudioTranscriptionRequest;

    return upload(audio)
      .then(async () => {
        audioTranscriptionRequestData = {
          filename: fileFullPath,
          fileBase64: await this.#audioFactory.audioToBase64(audio),
        } as AudioTranscriptionRequest;

        return fetch("/api/transcription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...useHeaders(),
          },
          body: JSON.stringify(audioTranscriptionRequestData),
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("An error occured while fetching the transcription.");
        }

        return await response.json();
      })
      .then((transcription: Transcription): void => {
        addMessage(
          messageFactory.fillWithTranscription(
            audioTranscriptionRequestData,
            transcription,
            dialogStore.currentMessageInProgress.value,
          ),
        );
      })
      .then((): Promise<void> => {
        return refreshDialogList();
      })
      .catch((error: Error) => {
        setRecorderCanBeActivated();

        throw error;
      });
  }
}
