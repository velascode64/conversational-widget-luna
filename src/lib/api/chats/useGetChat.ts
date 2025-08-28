import { useQuery } from "@tanstack/react-query";

import { ChatObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

interface GetChatParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

export async function getChat({ chatId, apiKey }: GetChatParams) {
  const response = await chatWidgetApi(`/chats/${chatId}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey!,
    },
  });

  const data: ChatObj = await response.json();

  return data;
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
