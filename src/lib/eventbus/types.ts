export type EventHandler<T = any> = (data: T) => void | Promise<void>;

export interface Event<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// User message sent event
export interface UserMessageEvent {
  type: 'USER_MESSAGE_SENT';
  payload: {
    message: string;
    messageId: string;
  };
  timestamp: number;
}

// AI response request event
export interface AIResponseRequestEvent {
  type: 'AI_RESPONSE_REQUESTED';
  payload: {
    message: string;
    messageId: string;
    apiKey: string;
  };
  timestamp: number;
}

// AI response chunk event (for streaming)
export interface AIResponseChunkEvent {
  type: 'AI_RESPONSE_CHUNK';
  payload: {
    chunk: string;
    messageId: string;
  };
  timestamp: number;
}

// AI response complete event
export interface AIResponseCompleteEvent {
  type: 'AI_RESPONSE_COMPLETE';
  payload: {
    fullResponse: string;
    messageId: string;
  };
  timestamp: number;
}

// AI response error event
export interface AIResponseErrorEvent {
  type: 'AI_RESPONSE_ERROR';
  payload: {
    error: string;
    messageId: string;
  };
  timestamp: number;
}

// Sidebar toggle event
export interface SidebarToggleEvent {
  type: 'SIDEBAR_TOGGLE';
  payload: {
    isOpen: boolean;
  };
  timestamp: number;
}

// Tool call event (when AI decides to use a tool)
export interface ToolCallEvent {
  type: 'TOOL_CALL';
  payload: {
    toolName: string;
    arguments: Record<string, any>;
    messageId: string;
  };
  timestamp: number;
}

// Clear chat event
export interface ClearChatEvent {
  type: 'CLEAR_CHAT';
  payload: {
    confirm: boolean;
  };
  timestamp: number;
}

// Theme change event
export interface ThemeChangeEvent {
  type: 'THEME_CHANGE';
  payload: {
    theme: 'light' | 'dark';
  };
  timestamp: number;
}

// Form submit event
export interface FormSubmitEvent {
  type: 'FORM_SUBMIT';
  payload: {
    formData: Record<string, any>;
    formType: string;
  };
  timestamp: number;
}

// Split view toggle event
export interface SplitViewEvent {
  type: 'SPLIT_VIEW_TOGGLE';
  payload: {
    page: 'settings' | 'form' | 'none';
    isOpen: boolean;
  };
  timestamp: number;
}

// Form fill event (AI fills form fields)
export interface FormFillEvent {
  type: 'FORM_FILL';
  payload: {
    name?: string;
    email?: string;
    message?: string;
  };
  timestamp: number;
}

// Sidebar resize event
export interface SidebarResizeEvent {
  type: 'SIDEBAR_RESIZE';
  payload: {
    size: 'small' | 'medium' | 'large';
  };
  timestamp: number;
}

// Page navigation event
export interface PageNavigateEvent {
  type: 'PAGE_NAVIGATE';
  payload: {
    page: 'chat' | 'settings' | 'form';
  };
  timestamp: number;
}

// Union type for all app events
export type AppEvent =
  | UserMessageEvent
  | AIResponseRequestEvent
  | AIResponseChunkEvent
  | AIResponseCompleteEvent
  | AIResponseErrorEvent
  | SidebarToggleEvent
  | ToolCallEvent
  | ClearChatEvent
  | ThemeChangeEvent
  | FormSubmitEvent
  | SplitViewEvent
  | FormFillEvent
  | SidebarResizeEvent
  | PageNavigateEvent;
