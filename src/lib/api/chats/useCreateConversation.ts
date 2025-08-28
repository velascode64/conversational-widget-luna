import { useMutation } from "@tanstack/react-query";

import { ChatConversatioinObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

interface CreateConversationParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

async function createConversation({
  apiKey,
  chatId,
}: CreateConversationParams) {
  const response = await chatWidgetApi(`/chats/${chatId}/conversations`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey!,
    },
  });

  const data: ChatConversatioinObj = await response.json();

  return data;
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: createConversation,
  });
}
