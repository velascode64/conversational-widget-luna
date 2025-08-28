import { cn } from '@/lib/cn';

interface ChatWidgetBodyProps {
  children?: React.ReactNode;
  className?: string;
}

function ChatWidgetBody({ children, className }: ChatWidgetBodyProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      {children}
    </div>
  );
}

export default ChatWidgetBody;
