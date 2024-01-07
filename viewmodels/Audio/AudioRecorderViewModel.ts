import { AudioRecorderState } from "~/types/Audio/AudioRecorder";
import AudioRecorder from "~/models/Audio/AudioRecorder";
import { useAudioRecorderStore } from "~/stores/Audio/recorder";
import type { Settings } from "~/types/Settings";

const settings: Settings = useGetSettings();

const audioRecorderStore = useAudioRecorderStore();
const isRecording = computed(() => audioRecorderStore.isRecording);
const canBeActivated = computed(() => audioRecorderStore.canBeActivated);
const { setState, activate: setRecorderCanBeActivated } = audioRecorderStore;

export default class AudioRecorderViewModel {
  private timeoutId: null | ReturnType<typeof setTimeout> = null;
  private seconds: Ref<number> = ref(0);
  private readonly recorder: AudioRecorder;

  constructor() {
    this.recorder = new AudioRecorder();
  }

  private startIterateSeconds(): void {
    ++this.seconds.value;

    this.timeoutId = setTimeout(() => {
      this.startIterateSeconds();
    }, 1000);
  }

  private setIdleState(): void {
    setState(AudioRecorderState.Idle);
    clearTimeout(this.timeoutId);
    this.seconds.value = 0;
  }

  public get getSeconds(): Readonly<Ref<number>> {
    return this.seconds;
  }

  public get isRecording(): Readonly<ComputedRef<boolean>> {
    return isRecording;
  }

  public get canBeActivated(): Readonly<ComputedRef<boolean>> {
    return canBeActivated;
  }

  public async startRecording(): Promise<void> {
    try {
      await this.recorder.start();
      setState(AudioRecorderState.Recording);
      this.startIterateSeconds();
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes(
            "mediaDevices API or getUserMedia method is not supported in this browser.",
          )
        ) {
          error.message =
            "To record audio, use browsers like Chrome and Firefox.";
        }

        error.message += `\n${this.recorder.getErrorMessage(error)}`;
      }

      this.setIdleState();
      setRecorderCanBeActivated();

      throw error;
    }
  }

  public async stopRecording(): Promise<Blob> {
    if (!isRecording.value) {
      return Promise.reject(new Error("Audio recorder is not recording."));
    }

    try {
      const audioAsBlob: void | Blob = await this.recorder.stop();
      if (this.seconds.value < settings.recorder.minDuration) {
        throw new Error(
          `The recording must be at least ${settings.recorder.minDuration} seconds long.`,
        );
      }

      if (this.seconds.value > settings.recorder.maxDuration) {
        throw new Error(
          `The recording must be at most ${settings.recorder.maxDuration} seconds long.`,
        );
      }

      if (!audioAsBlob) {
        throw new Error("Audio blob is not defined.");
      }

      this.setIdleState();

      return audioAsBlob;
    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case "InvalidStateError":
            error.message = "An InvalidStateError has occurred.";
            break;
        }
      }

      this.setIdleState();
      setRecorderCanBeActivated();

      throw error;
    }
  }

  public cancelRecording(): void {
    this.recorder.cancel();
    this.setIdleState();
    setRecorderCanBeActivated();
  }
}
