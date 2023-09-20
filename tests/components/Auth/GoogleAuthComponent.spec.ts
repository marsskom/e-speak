import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import { useLoginFormStore } from "~/stores/Form/login-form";

import GoogleAuthComponent from "~/components/Auth/GoogleAuthComponent.vue";

vi.mock("vuefire", () => ({
  useFirebaseAuth: vi.fn(),
}));
vi.mock("firebase/auth", () => ({
  getRedirectResult: () => new Promise(() => true),
  GoogleAuthProvider: vi.fn(),
  // eslint-disable-next-line prefer-promise-reject-errors
  signInWithPopup: () => Promise.reject("Error"),
}));

describe("GoogleAuthComponent", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(GoogleAuthComponent);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("has default state as false without any error", () => {
    expect(wrapper.find("button").attributes("disabled")).toEqual("");
    expect(wrapper.find(".error-box").exists()).toBe(false);
  });

  it("is enabled", async () => {
    const loginFromStore = useLoginFormStore();
    loginFromStore.acceptAgreement();

    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
  });

  it("toggles button disabled state", async () => {
    const loginFromStore = useLoginFormStore();
    loginFromStore.acceptAgreement();

    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toBeUndefined();

    loginFromStore.declineAgreement();

    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toEqual("");

    loginFromStore.acceptAgreement();

    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
  });

  it("pushes error on auth failure", async () => {
    wrapper.vm.singIn();

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.errors.length).toEqual(1);
    expect(wrapper.vm.errors[0]).toEqual("Error");

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".error-box").exists()).toBe(true);
  });
});
