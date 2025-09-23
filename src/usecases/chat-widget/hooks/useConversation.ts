import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

import {
  useCreateConversation,
  useGetChatConversationMessages,
} from "@/lib/api/chats";
import { useCompletionStreamN8n } from "@/lib/api/chats/useCompletionStreamN8n";
import { ChatWelcomeMessageObj, MessageType } from "@/lib/api/chats";
import { MessageStateDTO } from "@/lib/types/chat";

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

  // Handle messages reset - SIEMPRE mostrar mensaje de bienvenida si existe
  useEffect(() => {
    console.log('=== useConversation Debug ===');
    console.log('conversationId:', conversationId);
    console.log('welcomeMessage:', welcomeMessage);
    console.log('welcomeMessage?.message:', welcomeMessage?.message);

    if (!conversationId && welcomeMessage?.message) {
      console.log('Setting welcome message!');
      setMessages([
        {
          id: welcomeMessage.id || 'welcome',
          content: welcomeMessage.message,
          type: MessageType.AI,
        },
      ]);
      isNewConversationRef.current = false;
    } else if (!conversationId) {
      console.log('No welcome message, setting empty array');
      // Si no hay welcomeMessage pero tampoco conversationId, array vacío
      setMessages([]);
      isNewConversationRef.current = false;
    } else {
      console.log('Has conversationId, skipping welcome message');
    }
  }, [conversationId, welcomeMessage]);

  // Handle conversation messages loading
  useEffect(() => {
    if (
      conversationId &&
      conversationMessages.data &&
      !isNewConversationRef.current
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
  }, [conversationId, conversationMessages.data]);

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
