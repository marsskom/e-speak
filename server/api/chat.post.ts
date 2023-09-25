import { ChatCompletion } from "openai/resources/chat/completions";

import { getChatStream } from "~/server/utils/ai";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);
  const result: ChatCompletion = await getChatStream(messages);

  return result;
});
