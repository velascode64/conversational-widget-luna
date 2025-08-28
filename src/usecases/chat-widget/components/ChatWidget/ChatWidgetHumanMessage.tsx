import { UserIcon } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/cn';

import { useChatWidgetContext } from './ChatWidgetContext';

interface ChatWidgetHumanMessageProps {
  children: React.ReactNode;
  messageId: string;
  className?: string;
  scrollToOnMount?: boolean;
  onScrollTo?: (messageId: string) => void;
}

function ChatWidgetHumanMessage({
  children,
  messageId,
  scrollToOnMount,
  className,
  onScrollTo,
}: ChatWidgetHumanMessageProps) {
  const { messagesScrollRef } = useChatWidgetContext();

  useEffect(() => {
    if (scrollToOnMount && messagesScrollRef.current) {
      messagesScrollRef.current.scrollTo({
        top: messagesScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });

      onScrollTo?.(messageId);
    }
  }, [messagesScrollRef, messageId, scrollToOnMount, onScrollTo]);

  return (
    <div
      className={cn(
        'relative flex w-full items-start justify-end pl-4 pr-10',
        className,
      )}
    >
      <p className='prose-sm max-w-[280px] overflow-hidden rounded-md bg-[var(--chat-widget-primary)] px-3 py-2 text-white'>
        {children}
      </p>

      <div className='absolute right-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-solid border-[var(--chat-widget-primary)] bg-transparent text-[var(--chat-widget-primary)]'>
        <UserIcon size={20} />
      </div>
    </div>
  );
}

export default ChatWidgetHumanMessage;
