import { Dialog } from "~/types/Dialog/Dialog.d";

export interface DialogFactory {
  createEmpty(): Dialog;
}
