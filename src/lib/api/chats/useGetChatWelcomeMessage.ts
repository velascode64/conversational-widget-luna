import { useQuery } from '@tanstack/react-query';

import { ChatWelcomeMessageObj } from '@/lib/api/chats';

import { chatWidgetApi } from '../api';

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChatWelcomeMessage({ chatId, apiKey }: GetChatParams) {
  // Por ahora devolvemos un mensaje de bienvenida por defecto
  // N8N maneja los mensajes a través del webhook
  return {
    id: 'welcome',
    message: '👋 Hey there, welcome to Luna! Let me know if you need help booking a physical therapist or have any questions—I\'m here to help!\n\n- 📅 I\'d like to book a physical therapy appointment.\n- 💳 Can you help me understand my bill?\n- 🔁 I need to reschedule or cancel my session.\n- ❓ I have a general question about your services.',
    chat_id: chatId || 'default',
    organization_id: 1
  } as ChatWelcomeMessageObj;
}

interface UseGetChatWelcomeMessageParams {
  variables: GetChatParams;
}

export function useGetChatWelcomeMessage({
  variables,
}: UseGetChatWelcomeMessageParams) {
  return useQuery({
    enabled: !!variables.chatId || !!variables.apiKey,
    queryKey: ['api_chat_welcome_message', variables.chatId],
    queryFn: () => getChatWelcomeMessage(variables),
  });
}
