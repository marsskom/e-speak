import { ChatCompletion } from "openai/resources/chat/completions";

import CustomHeaders from "~/types/Headers.d";
import { getChatStream } from "~/server/utils/ai";
import useHeaders from "~/server/utils/headers";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);
  const customHeaders: CustomHeaders = useHeaders(event.headers);

  let result: ChatCompletion;
  if (customHeaders.isDummyChatDriver) {
    result = {
      id: "dummy",
      object: "text_completion",
      created: Date.now(),
      model: "dummy",
      choices: [
        {
          message: {
            content: "Dummy: Something interesting!",
            role: "assistant",
          },
          index: 0,
          finish_reason: "stop",
        },
      ],
    } as ChatCompletion;
  } else {
    result = await getChatStream(messages);
  }

  return result;
});
