export const useLoginFormStore = defineStore("login-form", () => {
  const isAgreementAcceptedValue: Ref<boolean> = ref(false);

  const isAgreementAccepted: ComputedRef<boolean> = computed(
    () => isAgreementAcceptedValue.value,
  );

  const acceptAgreement = (): void => {
    isAgreementAcceptedValue.value = true;
  };
  const declineAgreement = (): void => {
    isAgreementAcceptedValue.value = false;
  };

  return {
    isAgreementAccepted,

    acceptAgreement,
    declineAgreement,
  };
});
