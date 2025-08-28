import { useCallback } from "react";
import { useEffectOnce, useLocalStorage } from "react-use";

interface Conversation {
  id: string;
  timestamp: number;
}

export function useConversationId() {
  const [conversation, setConversation, removeConversation] =
    useLocalStorage<Conversation>("conversation");

  // Remove persisted conversation if timestamp is expired
  useEffectOnce(() => {
    if (!conversation) return;

    const hour = 1000 * 60 * 60;
    const timestamp = Date.now();

    if (timestamp - conversation.timestamp > hour) {
      removeConversation();
    }
  });

  const handleSetConversationId = useCallback(
    (value: string) => {
      setConversation({
        id: value,
        timestamp: Date.now(),
      });
    },
    [setConversation]
  );

  return [conversation?.id, handleSetConversationId] as const;
}
