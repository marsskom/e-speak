export const useLoginFormStore = defineStore("login-form", () => {
  const isAgreementAcceptedValue: Ref<boolean> = ref(false);
  const inProcessValue: Ref<boolean> = ref(false);

  const isAgreementAccepted: ComputedRef<boolean> = computed(
    () => isAgreementAcceptedValue.value,
  );
  const isInProcess: ComputedRef<boolean> = computed(
    () => inProcessValue.value,
  );

  const acceptAgreement = (): void => {
    isAgreementAcceptedValue.value = true;
  };
  const declineAgreement = (): void => {
    isAgreementAcceptedValue.value = false;
  };
  const setInProcess = (value: boolean): void => {
    inProcessValue.value = value;
  };

  return {
    isAgreementAcceptedValue,

    isAgreementAccepted,
    isInProcess,

    acceptAgreement,
    declineAgreement,

    setInProcess,
  };
});
