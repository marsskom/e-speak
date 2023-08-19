import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Counter from "../components/MyCounter.vue";

describe("Counter", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("is a Vue instance", () => {
    const wrapper = mount(Counter);
    expect(wrapper.vm).toBeTruthy();
  });

  it("can be incremented", () => {
    const wrapper = mount(Counter);
    expect(wrapper.find(".value").text()).toEqual("0");

    wrapper.find("button").trigger("click");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(".value").text()).toEqual("1");
    });
  });
});
