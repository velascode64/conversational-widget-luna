import { MessageType } from "@/lib/api/chats/types";

import { StreamableValue } from "../streaming";

type MessageDTO = {
  id: string;
  content: string;
  type: MessageType.HUMAN | MessageType.SYSTEM | MessageType.TOOL;
  scrollOnMount?: boolean;
};

type StreamableMessageDTO = {
  id: string;
  content: string | StreamableValue;
  type: MessageType.AI;
};

export type MessageStateDTO = MessageDTO | StreamableMessageDTO;
