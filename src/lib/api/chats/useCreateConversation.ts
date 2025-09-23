import { useMutation } from "@tanstack/react-query";

import { ChatConversatioinObj } from "@/lib/api/chats";

import { chatWidgetApi } from "../api";

interface CreateConversationParams {
  apiKey: string | null | undefined;
  chatId: string | null | undefined;
}

async function createConversation({
  apiKey,
  chatId,
}: CreateConversationParams) {
  // Generamos un ID de conversaci\u00f3n para N8N
  // N8N usa el sessionId para mantener el contexto
  // Generamos un ID solo en el cliente para evitar hydration mismatch
  const conversationId = typeof window !== 'undefined'
    ? `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    : 'session_temp_id';

  const now = new Date().toISOString();

  return {
    id: conversationId,
    chat_id: chatId || 'default',
    created_at: now,
    updated_at: now,
  } as ChatConversatioinObj;
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: createConversation,
  });
}
