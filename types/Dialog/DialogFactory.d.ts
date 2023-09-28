import { Dialog } from "~/types/Dialog/Dialog.d";

export declare interface DialogFactory {
  create(userUid: string = ""): Dialog;
}
