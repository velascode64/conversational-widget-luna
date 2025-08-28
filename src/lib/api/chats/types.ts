export enum MessageType {
  HUMAN = "human",
  SYSTEM = "system",
  AI = "ai",
  TOOL = "tool",
}

export type MessageObj = {
  id: string;
  content: string;
  type: MessageType;
};

export type MessageExampleObj = {
  heading: string;
  subheading: string;
  message: string;
};

export type ChatObj = {
  id: string;
  organization_ids: number[];
  name: string;
  state: ChatStateObj;
  updated_at: string;
  created_at: string;
};

export type ChatStateObj = {
  id: string;
  chat_id: string;
  organization_id: number;

  api_key: string;
  model: string;
  temperature: number;

  system_prompt: string;
  purpose_instructions: string;
  behaviour_instructions?: string;
  personality_instructions?: string;
  scripts_faq_instructions?: string;

  tool_ids: number[];

  is_memory_enabled: boolean;
  memory_instructions?: string;
};

export type DefaultChatStateObj = {
  id: string;
  is_active: boolean;
  purpose_instructions?: string;
  behaviour_instructions?: string;
  personality_instructions?: string;
  scripts_faq_instructions?: string;
  updated_at: string;
  created_at: string;
};

export type ChatConversatioinObj = {
  id: string;
  chat_id: string;
  agentic_user_id: string;
  organization_id: number;
  updated_at: string;
  created_at: string;
};

export type ChatWelcomeMessageObj = {
  id: string;
  message: string;
  chat_id: string;
  organization_id: number;
};

export type ChatWidgetLogoObj = {
  data_base64: string;
  filename: string;
  content_type: string;
};

export type ChatWidgetObj = {
  chat_id: string;
  organization_id: number;
  primary_color: string;
  secondary_color: string;
  logo?: ChatWidgetLogoObj;
};

export type PaginatedConversationsObj = {
  data: ChatConversatioinObj[];
  total_docs: number;
  limit: number;
  page: number;
  has_prev_page: boolean;
  has_next_page: boolean;
};
