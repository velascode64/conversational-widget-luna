import ChatWidgetControlFrame from "@/usecases/chat-widget/components/ChatWidgetControlFrame";
import { getChatWidgetConfig } from "@/lib/api/chats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ChatWidgetControlPageProps {
  searchParams: Promise<{
    widget_id: string;
    api_key: string;
    chat_id: string;
  }>;
}

async function ChatWidgetControlPage({
  searchParams,
}: ChatWidgetControlPageProps) {
  const params = await searchParams;

  const widgetConfig = await getChatWidgetConfig({
    chatId: params.chat_id,
    apiKey: params.api_key,
  });

  return (
    <ChatWidgetControlFrame
      widgetId={params.widget_id}
      widgetConfig={widgetConfig}
    />
  );
}

export default ChatWidgetControlPage;
