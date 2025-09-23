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
  // Por ahora devolvemos un array vac\u00edo
  // Los mensajes se manejan en el estado local con N8N
  return [] as MessageObj[];
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
