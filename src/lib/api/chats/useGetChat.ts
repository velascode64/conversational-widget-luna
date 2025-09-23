import { useQuery } from "@tanstack/react-query";

import { ChatObj } from "@/lib/api/chats";

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChat({ chatId }: GetChatParams): Promise<ChatObj> {
  // Por ahora devolvemos datos mock ya que N8N maneja todo
  return {
    id: chatId || 'default',
    name: 'Luna Assistant',
    organization_ids: [1],
    state: {
      id: 'default-state',
      chat_id: chatId || 'default',
      organization_id: 1,
      api_key: 'mock-key',
      model: 'gpt-4',
      temperature: 0.7,
      system_prompt: 'You are Luna Assistant',
      purpose_instructions: 'Help users with booking and questions',
      tool_ids: [],
      is_memory_enabled: true,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
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
