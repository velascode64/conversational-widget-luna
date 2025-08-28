import ChatWidgetFrame from "@/usecases/chat-widget/components/ChatWidgetFrame";
import {
  getChat,
  getChatWelcomeMessage,
  getChatWidgetConfig,
} from "@/lib/api/chats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WidgetChatPageProps {
  searchParams: {
    widget_id: string;
    api_key: string;
    chat_id: string;
  };
}

async function ChatWidgetPage({ searchParams }: WidgetChatPageProps) {
  const [chat, widgetConfig, welcomeMessage] = await Promise.all([
    getChat({
      chatId: searchParams.chat_id,
      apiKey: searchParams.api_key,
    }),
    getChatWidgetConfig({
      chatId: searchParams.chat_id,
      apiKey: searchParams.api_key,
    }),
    getChatWelcomeMessage({
      chatId: searchParams.chat_id,
      apiKey: searchParams.api_key,
    }),
  ]);

  return (
    <ChatWidgetFrame
      widgetId={searchParams.widget_id}
      apiKey={searchParams.api_key}
      chatId={searchParams.chat_id}
      chat={chat}
      widgetConfig={widgetConfig}
      welcomeMessage={welcomeMessage}
    />
  );
}

export default ChatWidgetPage;
