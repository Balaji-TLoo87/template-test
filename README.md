# Event-Driven AI Chat

A minimal Next.js application demonstrating event-driven architecture using the EventBus pattern with Groq API (Llama 3.3 70B) for AI chat functionality.

## Features

- **Event-Driven Architecture**: Decoupled components communicate via EventBus pattern
- **Real-time Streaming**: Progressive AI response display using Groq API streaming
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Clean Architecture**: Singleton EventBus with pub/sub pattern
- **Modern Stack**: Next.js 15 App Router, React 18, Tailwind CSS

## Architecture

### EventBus Pattern

The application uses a centralized EventBus for all component communication:

```
User Input → MessageInput → EventBus → ChatInterface (UI Update)
                                ↓
                          GeminiAgent
                                ↓
                          Gemini API
                                ↓
EventBus ← Stream Chunks ← GeminiAgent
   ↓
ChatInterface (Progressive Display)
```

### Event Flow

1. **USER_MESSAGE_SENT**: User submits a message
2. **AI_RESPONSE_REQUESTED**: Triggers AI response generation
3. **AI_RESPONSE_CHUNK**: Streams response chunks progressively
4. **AI_RESPONSE_COMPLETE**: Finalizes the streaming response
5. **AI_RESPONSE_ERROR**: Handles errors gracefully

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/chat/         # UI Components
│   ├── ChatInterface.tsx    # Main container with event subscriptions
│   ├── MessageList.tsx      # Message display
│   ├── MessageInput.tsx     # User input
│   └── ApiKeyInput.tsx      # API key configuration
├── lib/
│   ├── eventbus/           # EventBus Core
│   │   ├── EventBus.ts     # Singleton EventBus implementation
│   │   └── types.ts        # Event type definitions
│   ├── agents/             # AI Agents
│   │   └── GeminiAgent.ts  # Gemini API integration
│   └── storage/            # Storage utilities
│       └── apiKeyStorage.ts # localStorage wrapper
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key (get one free at [Groq Console](https://console.groq.com/keys))

### Installation

1. Clone or download this project

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Groq API key when prompted (starts with `gsk_`)

6. Start chatting!

7. Try natural language commands:
   - "close the sidebar"
   - "clear the chat"
   - "open the menu"

See [FUNCTION_CALLING.md](./FUNCTION_CALLING.md) for details on how AI tool use works.

### Build for Production

```bash
npm run build
npm start
```

## How It Works

### EventBus Singleton

The `EventBus` class provides a centralized pub/sub system:

```typescript
// Subscribe to events
const unsubscribe = eventBus.subscribe('EVENT_TYPE', (payload) => {
  // Handle event
});

// Emit events
eventBus.emit({
  type: 'EVENT_TYPE',
  payload: { /* data */ },
  timestamp: Date.now()
});

// Cleanup
unsubscribe();
```

### GeminiAgent (using Groq API)

The `GeminiAgent` listens for `AI_RESPONSE_REQUESTED` events and:
1. Calls the Groq API with streaming enabled (using Llama 3.3 70B model)
2. Emits `AI_RESPONSE_CHUNK` events for each chunk received
3. Maintains conversation history for context
4. Emits `AI_RESPONSE_COMPLETE` when done
5. Handles errors with `AI_RESPONSE_ERROR` events

### ChatInterface

The main UI component:
1. Subscribes to all relevant events
2. Manages message state
3. Coordinates event flow between user input and AI responses
4. Cleans up subscriptions on unmount (prevents memory leaks)

## Key Design Decisions

### Why EventBus?

- **Decoupling**: Components don't reference each other directly
- **Scalability**: Easy to add new event listeners without modifying existing code
- **Async-First**: Perfect for streaming AI responses
- **Testability**: Can mock events easily
- **Clear Communication**: Event names document system behavior

### Why Singleton Pattern?

- Single source of truth for all events
- No prop drilling or context providers needed
- Easy debugging (one place to log all events)
- Global access without complexity

### Why Client-Side API Key Storage?

- Simplifies minimal implementation
- User owns their own key
- No backend needed
- Acceptable for demo/learning purposes

> **Note**: For production, move API keys to server-side with encrypted storage

## Event Types

### USER_MESSAGE_SENT
- **Emitter**: MessageInput
- **Handler**: ChatInterface
- **Payload**: `{ message: string, messageId: string }`
- **Purpose**: Display user message immediately

### AI_RESPONSE_REQUESTED
- **Emitter**: ChatInterface
- **Handler**: GeminiAgent
- **Payload**: `{ message: string, messageId: string, apiKey: string }`
- **Purpose**: Trigger AI response generation

### AI_RESPONSE_CHUNK
- **Emitter**: GeminiAgent
- **Handler**: ChatInterface
- **Payload**: `{ chunk: string, messageId: string }`
- **Purpose**: Stream response progressively

### AI_RESPONSE_COMPLETE
- **Emitter**: GeminiAgent
- **Handler**: ChatInterface
- **Payload**: `{ fullResponse: string, messageId: string }`
- **Purpose**: Finalize streaming message

### AI_RESPONSE_ERROR
- **Emitter**: GeminiAgent
- **Handler**: ChatInterface
- **Payload**: `{ error: string, messageId: string }`
- **Purpose**: Display error messages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **AI API**: Groq (Llama 3.3 70B Versatile)
- **Runtime**: React 18

## Development Tips

### Debugging Events

The EventBus logs all events to the console:
```
[EventBus] USER_MESSAGE_SENT { message: "Hello", messageId: "user-123" }
[EventBus] AI_RESPONSE_REQUESTED { ... }
[EventBus] AI_RESPONSE_CHUNK { chunk: "Hi", messageId: "ai-456" }
```

### Memory Leak Prevention

Always return cleanup functions from `useEffect`:
```typescript
useEffect(() => {
  const unsubscribe = eventBus.subscribe('EVENT_TYPE', handler);
  return unsubscribe; // CRITICAL - prevents memory leaks
}, []);
```

### Avoid Stale Closures

Use functional state updates:
```typescript
setMessages((prev) => [...prev, newMessage]); // ✅ Correct
setMessages([...messages, newMessage]); // ❌ Stale closure
```

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Groq](https://groq.com/) - Fast AI inference with Llama 3.3 70B
- Inspired by event-driven architecture patterns from the referenced ChatGPT conversation

## Why Groq?

- **Generous Free Tier**: 30 requests/minute, 14,400 requests/day
- **Fast Inference**: Groq's LPU delivers incredibly fast response times
- **Powerful Model**: Llama 3.3 70B Versatile is capable and up-to-date
- **OpenAI Compatible**: Uses standard OpenAI API format
- **No Credit Card Required**: Sign up and start using immediately
# template-test
