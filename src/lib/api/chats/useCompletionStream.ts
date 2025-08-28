import { useMutation } from "@tanstack/react-query";

import { createStreamableValue } from "@/lib/streaming";

import { chatWidgetApi } from "../api";

interface ChatCompletionParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
  conversationId: string | null | undefined;
  content: string | null | undefined;
}

async function completionStream({
  apiKey,
  chatId,
  conversationId,
  content,
}: ChatCompletionParams) {
  const response = await chatWidgetApi(
    `/chats/${chatId}/conversations/${conversationId}/completion_stream`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
      headers: {
        "x-api-key": apiKey!,
      },
    }
  );

  const streamableValue = createStreamableValue(response);

  return streamableValue;
}

export function useCompletionStream() {
  return useMutation({
    mutationFn: completionStream,
  });
}
