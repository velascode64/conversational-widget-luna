function ChatWidgetSystemMessage({ children }: React.PropsWithChildren) {
  return (
    <div className='flex items-center justify-center gap-2 text-xs text-gray-500'>
      <p className='prose-sm max-w-[280px] flex-initial p-2'>{children}</p>
    </div>
  );
}

export default ChatWidgetSystemMessage;
