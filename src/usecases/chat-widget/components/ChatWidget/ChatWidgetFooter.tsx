import { cn } from '@/lib/cn';

interface ChatWidgetFooterProps {
  children?: React.ReactNode;
  className?: string;
}

function ChatWidgetFooter({ children, className }: ChatWidgetFooterProps) {
  return (
    <div className={cn('flex min-h-0 shrink-0 grow-0 items-center', className)}>
      {children}
    </div>
  );
}

export default ChatWidgetFooter;
