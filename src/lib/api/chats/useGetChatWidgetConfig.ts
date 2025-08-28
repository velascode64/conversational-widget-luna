import { useQuery } from "@tanstack/react-query";

import { type ChatWidgetObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

export interface GetChatWidgetConfigParams {
  chatId: string | null | undefined;
  apiKey: string | null | undefined;
}

export async function getChatWidgetConfig({
  chatId,
  apiKey,
}: GetChatWidgetConfigParams) {
  const response = await chatWidgetApi(`/chats/${chatId}/widget`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey!,
    },
  });

  const data: ChatWidgetObj = await response.json();

  return data;
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
