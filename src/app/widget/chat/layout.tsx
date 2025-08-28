import { Suspense } from "react";

function ChatWidgetLayout({ children }: React.PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}

export default ChatWidgetLayout;
