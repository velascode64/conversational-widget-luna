import { Suspense } from "react";

function ChatWidgetControlLayout({ children }: React.PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}

export default ChatWidgetControlLayout;
