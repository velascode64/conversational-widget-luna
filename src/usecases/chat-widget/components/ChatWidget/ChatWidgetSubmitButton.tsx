import { ArrowUpIcon, LoaderCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/cn';

export interface ChatWidgetSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

function ChatWidgetSubmitButton({
  className,
  type = 'button',
  loading,
  ...props
}: ChatWidgetSubmitButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-md bg-[var(--chat-widget-primary)] text-sm font-medium text-white ring-offset-background transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {loading && (
        <LoaderCircle width={20} height={20} className='animate-spin' />
      )}
      {!loading && <ArrowUpIcon width={20} height={20} />}
    </button>
  );
}

export default ChatWidgetSubmitButton;
