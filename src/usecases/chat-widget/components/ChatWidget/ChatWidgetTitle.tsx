import { cn } from '@/lib/cn';

function ChatWidgetTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn('text-lg font-bold text-white', className)} {...props}>
      {children}
    </h1>
  );
}

export default ChatWidgetTitle;
