<script setup lang="ts">
import { useLoginFormStore } from "~/stores/Form/login-form";
import { type EventChange } from "~/types/Form/Input/Checkbox";
import FormCheckbox from "~/components/Form/Input/Checkbox/FormCheckbox.vue";

const loginFormStore = useLoginFormStore();
const { acceptAgreement, declineAgreement } = loginFormStore;

const onCheckboxChange = (event: EventChange) =>
  event.isChecked ? acceptAgreement() : declineAgreement();
</script>

<template>
  <FormCheckbox
    id="agreement-checkbox"
    value="1"
    :checked="false"
    :required="true"
    @change="onCheckboxChange"
  >
    I agree with the
    <NuxtLink
      to="/terms-and-conditions"
      class="text-blue-600 hover:underline dark:text-blue-500"
      target="_blank"
      >terms and conditions
    </NuxtLink>
  </FormCheckbox>
</template>

<style scoped></style>
