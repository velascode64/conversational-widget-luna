import { Suspense } from "react";
import "../widget.css";

function ChatWidgetControlLayout({ children }: React.PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}

export default ChatWidgetControlLayout;
