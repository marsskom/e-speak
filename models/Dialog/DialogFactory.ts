import { v4 as uuidv4 } from "uuid";

import { Dialog } from "~/types/Dialog/Dialog.d";

export default class DialogFactory {
  create(userUid: string = ""): Dialog {
    return {
      userUid,
      uid: uuidv4(),
      name: "New Dialog",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      isSynced: false,
    };
  }
}
