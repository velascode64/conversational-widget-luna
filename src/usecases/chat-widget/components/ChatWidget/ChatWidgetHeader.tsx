import { cn } from '@/lib/cn';

interface ChatWidgetHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function ChatWidgetHeader({ children, className }: ChatWidgetHeaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 shrink-0 grow-0 items-center bg-[var(--chat-widget-primary)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ChatWidgetHeader;
