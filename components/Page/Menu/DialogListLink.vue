<script setup lang="ts">
import { useModal } from "tailvue";

import { type Dialog } from "~/types/Dialog/Dialog";
import PopupModal from "~/components/Page/PopupModal.vue";
import CopyLink from "~/components/Page/CopyLink.vue";

import { useDialogListStore } from "~/stores/Dialog/dialogList";
import { useDialogStore } from "~/stores/Dialog/dialog";

const modal = useModal();

const isAdvancedMode: ComputedRef<boolean> = useIsAdvancedMode();

const dialogListStore = useDialogListStore();
const { refresh: refreshDialogList } = dialogListStore;
const dialogList: ComputedRef<Dialog[]> = computed(
  () => dialogListStore.dialogList,
);
const isLoadingDialogList: ComputedRef<boolean> = computed(
  () => dialogListStore.isLoading,
);

const dialogStore = useDialogStore();
const { createEmptyDialog, loadDialog, deleteDialog } = dialogStore;
const currentDialog: ComputedRef<Dialog> = computed(
  () => dialogStore.currentDialog,
);

const dialogListPopup: Ref<null | typeof PopupModal> = ref(null);
const togglePopupVisibility = () => {
  if (!dialogListPopup.value) {
    return;
  }

  dialogListPopup.value.toggleVisibility();
};

const createNewDialog = (): void => {
  modal.show({
    type: "success",
    title: "Create new empty dialog?",
    primary: {
      label: "Yes",
      theme: "green",
      action: () => {
        createEmptyDialog();
        refreshDialogList();
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};

const onLoadDialog = (dialog: Dialog): void => {
  togglePopupVisibility();

  modal.show({
    type: "success",
    title: `Open "${dialog.name}" dialog?`,
    primary: {
      label: "Yes",
      theme: "green",
      action: () => {
        loadDialog(dialog.uid);
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};

const onDeleteDialog = (dialog: Dialog): void => {
  togglePopupVisibility();

  modal.show({
    type: "danger",
    title: `Delete "${dialog.name}" dialog?`,
    primary: {
      label: "Yes",
      theme: "red",
      action: () => {
        deleteDialog(dialog);
        refreshDialogList();
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => null,
    },
  });
};
</script>

<template>
  <div>
    <PopupModal ref="dialogListPopup" title="Dialog List" width="max-w-4xl">
      <template #button>
        <div class="flex">
          <a
            href="#"
            class="flex-col flex-2 items-center p-1 hover:text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-5/6"
            title="Open dialog list"
            @click="togglePopupVisibility"
          >
            <fa
              :icon="['fas', 'list']"
              class="w-3 h-3 text-gray-600 hover:text-gray-900 dark:text-white"
            />

            <span class="ml-3">Dialog List</span>
          </a>
          <a
            href="#"
            class="flex-col flex-1 p-1"
            title="Add new dialog"
            @click="createNewDialog"
          >
            <fa
              :icon="['fas', 'plus']"
              class="w-4 h-4 text-green-600 hover:text-green-800 dark:text-white font-bold text-lg"
            />
          </a>
        </div>
      </template>

      <template #content>
        <LoadingMask id="dialog-loading" :is-visible="isLoadingDialogList">
          <div class="flex flex-col text-sm">
            <table class="table-auto">
              <thead>
                <tr>
                  <th class="px-4 py-2 w-[70%]">Name</th>
                  <th class="px-4 py-2 w-[10%]">Synced</th>
                  <th class="px-4 py-2 w-[20%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!dialogList.length">
                  <td class="text-center font-bold" colspan="3">
                    Data Not Found
                  </td>
                </tr>

                <tr
                  v-for="dialog in dialogList"
                  :key="dialog.uid"
                  :class="currentDialog.uid === dialog.uid ? 'bg-gray-100' : ''"
                >
                  <td class="border px-4 py-2">
                    {{ dialog.name }}
                    <p class="mt-1 text-gray-500 text-xs">
                      {{ dialog.createdAt.toISOString() }}
                    </p>
                    <p v-if="isAdvancedMode" class="mt-1 text-gray-500 text-xs">
                      <CopyLink :content="dialog.uid" />
                      {{ dialog.uid }}
                    </p>
                  </td>
                  <td class="border px-4 py-2 text-center">
                    <a v-if="dialog.isSynced" href="#" title="Synced">
                      <fa
                        :icon="['far', 'square-check']"
                        class="ml-2 w-4 h-4 text-green-600 hover:text-green-900 dark:text-white font-bold"
                      ></fa>
                    </a>
                    <a v-if="!dialog.isSynced" href="#" title="Not Synced">
                      <fa
                        :icon="['far', 'square-minus']"
                        class="ml-2 w-4 h-4 text-yellow-600 hover:text-yellow-900 dark:text-white font-bold"
                      ></fa>
                    </a>
                  </td>
                  <td class="border px-4 py-2 text-right">
                    <a
                      href="#"
                      class="text-blue-500 hover:text-blue-800"
                      title="Open"
                      @click="onLoadDialog(dialog)"
                    >
                      <fa
                        :icon="['fas', 'external-link-alt']"
                        class="w-4 h-4"
                      ></fa>
                    </a>
                    <span class="mx-2">|</span>
                    <a
                      href="#"
                      class="text-red-500 hover:text-red-800"
                      title="Delete"
                      @click="onDeleteDialog(dialog)"
                    >
                      <fa :icon="['fas', 'trash-alt']" class="w-4 h-4"></fa>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </LoadingMask>
      </template>
    </PopupModal>
  </div>
</template>

<style scoped></style>
