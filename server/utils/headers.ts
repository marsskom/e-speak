import CustomHeaders from "~/types/Headers.d";
import { ChatDriver } from "~/types/Settings.d";

// TODO [STORES]: why stores aren't available on server side?
export default function (headers: Headers) {
  return {
    audioParams: {
      mimeType: headers.get("x-audio-mime-type") || "",
      prefix: headers.get("x-audio-prefix") || "",
    },
    dialogUid: headers.get("x-audio-dialog-uid") || "",
    messageUid: headers.get("x-audio-message-uid") || "",
    chatDriver: headers.get("x-chat-driver") || "",
    isDummyChatDriver:
      headers.get("x-chat-driver")?.toLowerCase() ===
      ChatDriver.Dummy.valueOf().toLowerCase(),
  } as CustomHeaders;
}
