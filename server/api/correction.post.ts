import { type ChatCompletion } from "openai/resources/chat/completions";

import type CustomHeaders from "~/types/Headers";
import { getChatStream } from "~/server/utils/ai";
import useHeaders from "~/server/utils/headers";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);
  const customHeaders: CustomHeaders = useHeaders(event.headers);

  let result: ChatCompletion;
  if (customHeaders.isDummyChatDriver) {
    result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "dummy",
          object: "text_completion",
          created: Date.now(),
          model: "dummy",
          choices: [
            {
              message: {
                content: "Dummy: Correction!",
                role: "assistant",
              },
              index: 0,
              finish_reason: "stop",
            },
          ],
        } as ChatCompletion);
      }, 1000);
    });
  } else {
    result = await getChatStream(messages);
  }

  return result;
});
