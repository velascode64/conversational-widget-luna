import { useQuery } from '@tanstack/react-query';

import { ChatWelcomeMessageObj } from '@/lib/api/chats';

import { chatWidgetApi } from '../api';

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChatWelcomeMessage({ chatId, apiKey }: GetChatParams) {
  try {
    const response = await chatWidgetApi(`/chats/${chatId}/welcome_message`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    });

    const data: ChatWelcomeMessageObj = await response.json();

    if (response.status !== 200 || !data) {
      throw Error('Failed to load chat welcome message');
    }

    return data;
  } catch {
    return null;
  }
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
