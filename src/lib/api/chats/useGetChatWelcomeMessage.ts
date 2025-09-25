import { useQuery } from '@tanstack/react-query';

import { ChatWelcomeMessageObj } from '@/lib/api/chats';

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChatWelcomeMessage({ chatId }: GetChatParams) {
  // Por ahora devolvemos un mensaje de bienvenida por defecto
  // N8N maneja los mensajes a través del webhook
  return {
    id: 'welcome',
    message: '👋 Welcome to Luna!\n\nHow can I help you today? Whether you\'d like to schedule an in-home PT session, see if we serve your ZIP code, or ask anything else, just let me know. Popular things people ask about include:\n\n• Scheduling a visit\n\n• Checking service areas\n\n• Insurance, treatments, or any other questions\n\nFeel free to start with one of those—or anything on your mind. I\'m here for you!',
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
