import { useQuery } from "@tanstack/react-query";

import { ChatObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChat({ chatId, apiKey }: GetChatParams) {
  // Por ahora devolvemos datos mock ya que N8N maneja todo
  // El apiKey se mantiene para uso futuro
  return {
    id: chatId || 'default',
    name: 'Luna Assistant',
    organization_id: 'neowork',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as ChatObj;
}

interface UseGetChatParams {
  variables: GetChatParams;
}

export function useGetChat({ variables }: UseGetChatParams) {
  return useQuery({
    enabled: !!variables.chatId || !!variables.apiKey,
    queryKey: ["api_chats", variables.chatId],
    queryFn: () => getChat(variables),
  });
}
