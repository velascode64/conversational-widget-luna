import { useQuery } from "@tanstack/react-query";

import { type ChatWidgetObj } from "@/lib/api/chats";

export interface GetChatWidgetConfigParams {
  chatId: string | null | undefined;
  apiKey: string | null | undefined;
}

export async function getChatWidgetConfig({
  chatId,
}: GetChatWidgetConfigParams) {
  // Simplificado para N8N - devuelve configuración por defecto
  // El apiKey se mantiene para uso futuro
  return {
    chat_id: chatId || 'default',
    organization_id: 1,
    primary_color: '#974ebc',
    secondary_color: '#f4f6f8',
    logo: {
      data_base64: '',
      filename: 'luna-logo.jpg',
      content_type: 'image/jpeg'
    }
  } as ChatWidgetObj;
}

interface UseGetChatWidgetConfig {
  variables: GetChatWidgetConfigParams;
}

export function useGetChatWidgetConfig({ variables }: UseGetChatWidgetConfig) {
  return useQuery({
    enabled: !!variables.chatId && !!variables.apiKey,
    queryKey: ["api_chat_widget_config", variables.chatId],
    queryFn: () => getChatWidgetConfig(variables),
  });
}
