import { Suspense } from "react";
import "../widget.css";

function ChatWidgetLayout({ children }: React.PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}

export default ChatWidgetLayout;
