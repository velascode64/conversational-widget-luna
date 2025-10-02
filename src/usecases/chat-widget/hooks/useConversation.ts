import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

import {
  useCreateConversation,
  useGetChatConversationMessages,
} from "@/lib/api/chats";
import { useCompletionStreamN8n } from "@/lib/api/chats/useCompletionStreamN8n";
import { ChatWelcomeMessageObj, MessageType } from "@/lib/api/chats";
import { MessageStateDTO } from "@/lib/types/chat";
import { getWelcomeMessageFromN8n } from "@/lib/api/n8n/api";

import { useConversationId } from "./useConversationId";

interface UseConversationParams {
  apiKey: string;
  chatId: string;
  welcomeMessage?: ChatWelcomeMessageObj | null;
}

export function useConversation({
  apiKey,
  chatId,
  welcomeMessage,
}: UseConversationParams) {
  const [conversationId, updateConversationId] = useConversationId();
  const [messages, setMessages] = useState<MessageStateDTO[]>([]);
  const isNewConversationRef = useRef(false);

  const conversationMessages = useGetChatConversationMessages({
    variables: {
      apiKey,
      chatId,
      conversationId,
    },
  });

  // Handle messages reset - Mostrar welcomeMessage si existe
  useEffect(() => {
    console.log('=== useConversation Debug ===');
    console.log('conversationId:', conversationId);
    console.log('welcomeMessage:', welcomeMessage);

    if (welcomeMessage?.message) {
      console.log('Setting welcome message');
      setMessages([
        {
          id: welcomeMessage.id || 'welcome',
          content: welcomeMessage.message,
          type: MessageType.AI,
        },
      ]);
      return;
    }

    if (!conversationId) {
      console.log('No welcomeMessage, no conversationId - setting empty');
      setMessages([]);
    }
  }, [conversationId, welcomeMessage]);

  // Handle conversation messages loading
  useEffect(() => {
    if (
      conversationId &&
      conversationMessages.data &&
      !isNewConversationRef.current &&
      !welcomeMessage?.message  // NO sobrescribir si hay welcomeMessage
    ) {
      const displayMessageTypes = [MessageType.AI, MessageType.HUMAN];

      setMessages(() => {
        return conversationMessages.data.filter((message) => {
          return (
            displayMessageTypes.includes(message.type) &&
            message.content?.trim?.()
          );
        });
      });
    }
  }, [conversationId, conversationMessages.data, welcomeMessage]);

  const createConversation = useCreateConversation();
  const completionStream = useCompletionStreamN8n();


  const sendMessage = async (content: string) => {
    let convId = conversationId;

    // If no conversation create one
    if (!convId) {
      isNewConversationRef.current = true;

      const { id } = await createConversation.mutateAsync({
        apiKey,
        chatId,
      });

      convId = id;
    }

    // Update conversation id
    // Implicitly updates expiration time because conversation being re-used
    updateConversationId(convId);

    // Update local state of the conversation with new user message
    setMessages((messages) => {
      return [
        ...messages,
        {
          id: nanoid(),
          type: MessageType.HUMAN,
          content,
          scrollOnMount: true,
        },
      ];
    });

    // Submit the user message to get streaming response
    const response = await completionStream.mutateAsync({
      conversationId: convId,
      content,
      apiKey,
      chatId,
    });

    // Insert response in the conversations list
    setMessages((messages) => {
      return [
        ...messages,
        {
          id: nanoid(),
          type: MessageType.AI,
          content: response,
        },
      ];
    });
  };

  const resetScrollToMessage = (id: string) => {
    setMessages((messages) => {
      return messages.map((message) => {
        return message.id === id
          ? { ...message, scrollOnMount: false }
          : message;
      });
    });
  };

  return {
    messages,
    sendMessage,
    resetScrollToMessage,
    isLoading:
      completionStream.isPending ||
      createConversation.isPending ||
      conversationMessages.isFetching,
  };
}
