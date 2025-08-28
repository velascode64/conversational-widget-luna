import { useQuery } from "@tanstack/react-query";

import { MessageObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

interface GetChatConversationMessagesParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
  conversationId: string | null | undefined;
}

async function getChatConversationMessages({
  apiKey,
  chatId,
  conversationId,
}: GetChatConversationMessagesParams) {
  const response = await chatWidgetApi(
    `/chats/${chatId}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey!,
      },
    }
  );

  const data: MessageObj[] = await response.json();

  return data;
}

interface UseGetChatConversationMessagesParams {
  variables: GetChatConversationMessagesParams;
}

export function useGetChatConversationMessages({
  variables,
}: UseGetChatConversationMessagesParams) {
  return useQuery({
    enabled:
      !!variables.apiKey && !!variables.chatId && !!variables.conversationId,

    queryKey: [
      "api_chat_conversation_messages",
      variables.chatId,
      variables.conversationId,
    ],

    queryFn: () => {
      return getChatConversationMessages(variables);
    },

    refetchOnWindowFocus: false,
  });
}
