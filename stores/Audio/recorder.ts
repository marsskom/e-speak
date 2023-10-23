import { AudioRecorderState } from "~/types/Audio/AudioRecorder";

export const useAudioRecorderStore = defineStore("audioRecorder", () => {
  const state: Ref<AudioRecorderState> = ref(AudioRecorderState.Idle);
  const canBeActivatedValue: Ref<boolean> = ref(true);

  const isRecording: ComputedRef<boolean> = computed(
    () => state.value === AudioRecorderState.Recording,
  );
  const canBeActivated: ComputedRef<boolean> = computed(
    () => canBeActivatedValue.value === true,
  );

  const setState = (newState: AudioRecorderState): void => {
    state.value = newState;
  };
  const activate = (): void => {
    canBeActivatedValue.value = true;
  };
  const deactivate = (): void => {
    canBeActivatedValue.value = false;
  };

  return {
    state,
    canBeActivatedValue,

    isRecording,
    canBeActivated,

    setState,
    activate,
    deactivate,
  };
});
