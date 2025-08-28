import { useEffect, useState } from "react";

export function NoSSR({ children }: React.PropsWithChildren) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return <>{isMounted && children}</>;
}
