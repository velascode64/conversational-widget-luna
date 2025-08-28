// The same events are also defined in /public/chat-widget.js
export enum ChatWidgetEvents {
  CONTROL_LOADED_SUCCESS = "widget_control_loaded_success",
  CONTROL_LOADED_FAILURE = "widget_control_loaded_failure",
  CONTROL_OPEN = "widget_control_open",
  CONTROL_CLOSE = "widget_control_close",
  CHAT_LOADED_SUCCESS = "widget_chat_loaded_success",
  CHAT_LOADED_FAILURE = "widget_chat_loaded_failure",
  CHAT_CLOSE = "widget_chat_close",
  CHAT_OPENED = "widget_chat_opened",
  CHAT_CLOSED = "widget_chat_closed",
}

// Default chat widget colors
export const DEFAULT_PRIMARY_COLOR = "#000000";
export const DEFAULT_SECONDARY_COLOR = "#fefcf8";
