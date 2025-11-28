# Function Calling / Tool Use

This application demonstrates **AI-driven function calling** where the LLM decides what actions to take based on user intent, rather than hardcoded command detection.

## How It Works

### 1. **User sends natural language**
```
User: "close the sidebar"
User: "can you hide the menu?"
User: "clear the chat history"
```

### 2. **LLM receives tools definition**
The AI model receives a list of available tools with their schemas:

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "toggle_sidebar",
        "description": "Open or close the sidebar menu",
        "parameters": {
          "type": "object",
          "properties": {
            "action": {
              "type": "string",
              "enum": ["open", "close"]
            }
          }
        }
      }
    }
  ]
}
```

### 3. **LLM decides to call a tool**
Based on understanding the user's intent, the LLM responds with structured JSON:

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_123",
      "type": "function",
      "function": {
        "name": "toggle_sidebar",
        "arguments": "{\"action\": \"close\"}"
      }
    }
  ]
}
```

### 4. **GeminiAgent executes the tool**
```typescript
// Agent receives tool call from LLM
executeTool('toggle_sidebar', { action: 'close' })

// Emits event via EventBus
eventBus.emit({
  type: 'SIDEBAR_TOGGLE',
  payload: { isOpen: false }
})
```

### 5. **UI responds to event**
```typescript
// ChatInterface subscribes to events
eventBus.subscribe('SIDEBAR_TOGGLE', (payload) => {
  setIsSidebarOpen(payload.isOpen);
});
```

## Event Flow Diagram

```
┌─────────────────────┐
│ User: "close sidebar"│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│  MessageInput Component │
└──────────┬──────────────┘
           │
           │ USER_MESSAGE_SENT
           ▼
┌──────────────────────────────┐
│      EventBus                │
└──────────┬───────────────────┘
           │
           │ AI_RESPONSE_REQUESTED
           ▼
┌──────────────────────────────┐
│      GeminiAgent             │
│  (calls Groq API with tools) │
└──────────┬───────────────────┘
           │
           │ Groq returns tool_call
           ▼
┌──────────────────────────────┐
│  GeminiAgent.executeTool()   │
│  - Parses tool call JSON     │
│  - Calls toggle_sidebar      │
└──────────┬───────────────────┘
           │
           │ SIDEBAR_TOGGLE event
           ▼
┌──────────────────────────────┐
│      EventBus                │
└──────────┬───────────────────┘
           │
           │ Subscribers notified
           ▼
┌──────────────────────────────┐
│   ChatInterface              │
│   - Updates isSidebarOpen    │
│   - Sidebar closes           │
└──────────────────────────────┘
```

## Available Tools

### 1. toggle_sidebar
**Purpose**: Open or close the sidebar menu

**Parameters**:
- `action`: "open" | "close"

**Example prompts**:
- "close the sidebar"
- "hide the menu"
- "show the sidebar"
- "open the menu"

**Event emitted**: `SIDEBAR_TOGGLE`

### 2. clear_chat
**Purpose**: Clear all messages from chat history

**Parameters**:
- `confirm`: boolean

**Example prompts**:
- "clear the chat"
- "reset conversation"
- "start over"
- "delete chat history"

**Event emitted**: `CLEAR_CHAT`

## Adding New Tools

### Step 1: Define the tool in `src/lib/agents/tools.ts`

```typescript
export const availableTools = [
  // ... existing tools
  {
    type: 'function',
    function: {
      name: 'send_email',
      description: 'Send an email to a recipient',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'Email address of recipient',
          },
          subject: {
            type: 'string',
            description: 'Email subject line',
          },
          body: {
            type: 'string',
            description: 'Email body content',
          },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  },
];
```

### Step 2: Add event type in `src/lib/eventbus/types.ts`

```typescript
export interface SendEmailEvent {
  type: 'SEND_EMAIL';
  payload: {
    to: string;
    subject: string;
    body: string;
  };
  timestamp: number;
}

export type AppEvent =
  | UserMessageEvent
  | ...
  | SendEmailEvent;
```

### Step 3: Implement tool execution in `GeminiAgent.ts`

```typescript
private async executeTool(toolName: string, args: Record<string, any>): Promise<any> {
  switch (toolName) {
    // ... existing cases

    case 'send_email':
      this.eventBus.emit<AppEvent>({
        type: 'SEND_EMAIL',
        payload: {
          to: args.to,
          subject: args.subject,
          body: args.body,
        },
        timestamp: Date.now(),
      });
      return { success: true, message: 'Email sent' };

    default:
      return { success: false, error: 'Unknown tool' };
  }
}
```

### Step 4: Subscribe to the event in your component

```typescript
useEffect(() => {
  const eventBus = EventBus.getInstance();

  const unsubscribeEmail = eventBus.subscribe(
    'SEND_EMAIL',
    (payload: { to: string; subject: string; body: string }) => {
      // Handle sending email
      console.log('Sending email:', payload);
    }
  );

  return () => unsubscribeEmail();
}, []);
```

## Benefits of This Approach

### 1. **Natural Language Understanding**
Users don't need to memorize exact commands. The LLM understands:
- "close sidebar" ✅
- "hide the menu" ✅
- "can you close that thing on the left?" ✅

### 2. **Flexible and Extensible**
- Add new tools without modifying UI code
- LLM automatically learns to use new tools
- No hardcoded command parsing

### 3. **Event-Driven**
- Tools emit events via EventBus
- Loose coupling between components
- Easy to test and debug

### 4. **Conversation Context**
- LLM can combine tool use with conversation
- "Sure, I'll close the sidebar for you. What else can I help with?"
- Natural back-and-forth interaction

## Debugging

Enable console logging to see tool calls:

```typescript
// In GeminiAgent.ts
console.log('Tool call received:', toolCall);
console.log('Executing tool:', toolName, args);
```

Check EventBus logs:
```typescript
// In EventBus.ts - already enabled
console.log(`[EventBus] ${event.type}`, event.payload);
```

## Limitations

- Groq's Llama 3.3 70B supports function calling
- Tools must be defined upfront (can't be created dynamically)
- Tool execution must be fast (synchronous operations preferred)
- Error handling should be robust for tool failures

## References

- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Groq Function Calling](https://console.groq.com/docs/tool-use)
- Event-driven architecture patterns from the ChatGPT conversation reference
