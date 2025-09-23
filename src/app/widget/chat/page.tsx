import ChatWidgetFrame from "@/usecases/chat-widget/components/ChatWidgetFrame";
import {
  getChat,
  getChatWelcomeMessage,
  getChatWidgetConfig,
} from "@/lib/api/chats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WidgetChatPageProps {
  searchParams: Promise<{
    widget_id: string;
    api_key: string;
    chat_id: string;
  }>;
}

async function ChatWidgetPage({ searchParams }: WidgetChatPageProps) {
  const params = await searchParams;

  const [chat, widgetConfig, welcomeMessage] = await Promise.all([
    getChat({
      chatId: params.chat_id,
      apiKey: params.api_key,
    }),
    getChatWidgetConfig({
      chatId: params.chat_id,
      apiKey: params.api_key,
    }),
    getChatWelcomeMessage({
      chatId: params.chat_id,
      apiKey: params.api_key,
    }),
  ]);

  return (
    <ChatWidgetFrame
      widgetId={params.widget_id}
      apiKey={params.api_key}
      chatId={params.chat_id}
      chat={chat}
      widgetConfig={widgetConfig}
      welcomeMessage={welcomeMessage}
    />
  );
}

export default ChatWidgetPage;
