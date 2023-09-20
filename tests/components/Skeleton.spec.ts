import { beforeEach, describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import { useSkeletonStore } from "~/stores/skeleton";

import Skeleton from "~/components/Skeleton.vue";

describe("Skeleton", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(Skeleton, {
      slots: {
        page: "Page content",
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("is active by default", () => {
    expect(wrapper.find(".skeleton").exists()).toBe(true);
    expect(wrapper.find(".skeleton").text()).toContain("Loading...");
  });

  it("reacts to store changes", async () => {
    const skeletonStore = useSkeletonStore();
    const { show, hide } = skeletonStore;

    hide();

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".skeleton").exists()).toBe(false);

    show();

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".skeleton").exists()).toBe(true);
  });

  it("has page slot", async () => {
    const skeletonStore = useSkeletonStore();
    const { hide } = skeletonStore;

    hide();

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".loading-content").text()).toContain("Page content");
  });

  it("'s skeleton slot template may be overridden", async () => {
    wrapper = mount(Skeleton, {
      slots: {
        skeleton: "Skeleton content",
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".loading-content").text()).toContain(
      "Skeleton content",
    );
  });
});
