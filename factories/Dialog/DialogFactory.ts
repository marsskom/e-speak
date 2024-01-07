import { v4 as uuidv4 } from "uuid";

import { type Dialog } from "~/types/Dialog/Dialog";

export default class DialogFactory {
  public create(userUid: string = ""): Dialog {
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
