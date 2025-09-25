"use client";

import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { NoSSR } from "@/components/NoSSR";
import {
  ChatObj,
  ChatWelcomeMessageObj,
  ChatWidgetObj,
  MessageType,
} from "@/lib/api/chats";

import {
  ChatWidget,
  ChatWidgetBody,
  ChatWidgetAiMessage,
  ChatWidgetButton,
  ChatWidgetHeader,
  ChatWidgetHumanMessage,
  ChatWidgetLogo,
  ChatWidgetMessageInput,
  ChatWidgetMessageList,
  ChatWidgetSystemMessage,
  ChatWidgetTitle,
} from "../ChatWidget";
import { ChatWidgetEvents } from "../../lib/constants";
import { useConversation } from "../../hooks/useConversation";
import { useSendWidgetEvent } from "../../hooks/useSendWidgetEvent";
import { useListenWidgetEvents } from "../../hooks/useListenWidgetEvents";

interface ChatWidgetFramgeProps {
  widgetId: string;
  apiKey: string;
  chatId: string;
  chat: ChatObj;
  widgetConfig: ChatWidgetObj;
  welcomeMessage?: ChatWelcomeMessageObj | null;
}

function ChatWidgetFramge({
  widgetId,
  apiKey,
  chatId,
  chat,
  widgetConfig,
  welcomeMessage,
}: ChatWidgetFramgeProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [isOpened, setIsOpened] = useState(false);

  // Usar imagen de placeholder morada
  const logoSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23974ebc"/%3E%3Cpath d="M30 50a20 20 0 0740 0" fill="white" opacity="0.3"/%3E%3C/svg%3E';

  const conversation = useConversation({
    apiKey,
    chatId,
    welcomeMessage: welcomeMessage,
  });

  const sendWidgetEvent = useSendWidgetEvent();

  const handleOnCloseClick = () => {
    sendWidgetEvent({
      widgetId,
      type: ChatWidgetEvents.CHAT_CLOSE,
    });
  };

  useEffect(() => {
    if (widgetId && widgetConfig) {
      sendWidgetEvent({
        widgetId,
        type: ChatWidgetEvents.CONTROL_LOADED_SUCCESS,
      });
    }
  }, [sendWidgetEvent, widgetConfig, widgetId]);

  // Scroll to the bottom of messages list when widget is opened and messages are loaded
  const isMessagesLoaded = conversation.messages?.length > 0;

  useEffect(() => {
    if (messagesRef.current && isMessagesLoaded && isOpened) {
      setTimeout(() => {
        messagesRef.current?.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: "smooth",
        });
        // 300 ms because of open animation in the script is 300 ms
        // TODO: think of a better solution
      }, 300);
    }
  }, [isMessagesLoaded, isOpened]);

  // Listen widget script events
  useListenWidgetEvents({
    widgetId,
    onEvent: (type) => {
      if (type === ChatWidgetEvents.CHAT_CLOSED) {
        setIsOpened(false);
        return;
      }

      if (type === ChatWidgetEvents.CHAT_OPENED) {
        setIsOpened(true);
        return;
      }
    },
  });

  // Focus input when widget is opened
  useEffect(() => {
    if (isOpened) {
      inputRef.current?.focus();
    }
  }, [isOpened]);

  return (
    <ChatWidget
      primaryColor={widgetConfig.primary_color}
      secondaryColor={widgetConfig.secondary_color}
    >
      <ChatWidgetHeader className="flex min-h-12 items-center justify-start gap-2 px-3 py-2 pr-3">
        <ChatWidgetLogo src={logoSrc} />
        <ChatWidgetTitle>{chat.name}</ChatWidgetTitle>

        <ChatWidgetButton className="ml-auto" onClick={handleOnCloseClick}>
          <XIcon size={20} />
        </ChatWidgetButton>
      </ChatWidgetHeader>

      <ChatWidgetBody>
        <ChatWidgetMessageList scrollRef={messagesRef}>
          {/* Messages list is dependent on the client side cookie therefore we need to use NoSSR to prevent hydration error */}
          <NoSSR>
            {conversation.messages.map((message) => {
              if (message.type === MessageType.SYSTEM) {
                return (
                  <ChatWidgetSystemMessage key={message.id}>
                    {message.content}
                  </ChatWidgetSystemMessage>
                );
              }

              if (message.type === MessageType.HUMAN) {
                return (
                  <ChatWidgetHumanMessage
                    key={message.id}
                    messageId={message.id}
                    scrollToOnMount={message.scrollOnMount}
                    onScrollTo={conversation.resetScrollToMessage}
                  >
                    {message.content}
                  </ChatWidgetHumanMessage>
                );
              }

              return (
                <ChatWidgetAiMessage
                  key={message.id}
                  content={message.content}
                  logoSrc={logoSrc}
                />
              );
            })}
          </NoSSR>
        </ChatWidgetMessageList>

        <NoSSR>
          <ChatWidgetMessageInput
            ref={inputRef}
            className="mx-3 mb-3"
            onSubmit={conversation.sendMessage}
            loading={conversation.isLoading}
          />
        </NoSSR>
      </ChatWidgetBody>
    </ChatWidget>
  );
}

export default ChatWidgetFramge;
