# Quick Start Guide

## Setup (2 minutes)

1. **Get Groq API Key** (Free, no credit card)
   - Visit: https://console.groq.com/keys
   - Sign up with Google/GitHub
   - Click "Create API Key"
   - Copy the key (starts with `gsk_`)

2. **Start the App**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Go to: http://localhost:3000
   - Paste your API key
   - Click "Save API Key"

## Try It Out!

### Chat Normally
```
You: "What is event-driven architecture?"
AI: [Explains event-driven architecture...]
```

### Control the Sidebar with Natural Language
```
You: "close the sidebar"
AI: [Sidebar closes automatically]

You: "can you show the menu?"
AI: [Sidebar opens]

You: "hide that thing on the left"
AI: [Sidebar closes]
```

### Clear Chat History
```
You: "clear the chat"
AI: [Chat history clears]

You: "start over"
AI: [Resets conversation]
```

### Combined Actions
```
You: "close the sidebar and tell me a joke"
AI: [Closes sidebar, then tells a joke]
```

## How It Works

The AI **understands your intent** and decides what actions to take:

1. **You type natural language** → Any phrasing works
2. **AI analyzes intent** → Uses function calling
3. **AI calls appropriate tool** → Returns structured JSON
4. **App executes action** → Via EventBus pattern
5. **UI updates** → Sidebar closes, chat clears, etc.

## Architecture Highlights

```
Natural Language Input
        ↓
    AI (Llama 3.3 70B)
        ↓
   Function Call JSON
        ↓
     EventBus
        ↓
   UI Updates
```

## Available Commands

The AI understands variations of:

**Sidebar Control:**
- "close sidebar" / "hide sidebar"
- "open sidebar" / "show sidebar"
- "toggle menu" / "hide the menu"

**Chat Management:**
- "clear chat" / "clear history"
- "reset conversation" / "start over"
- "delete messages"

**And natural variations like:**
- "can you close that sidebar thing?"
- "please hide the menu on the left"
- "I want to start a fresh conversation"

## Key Features

✅ **No Exact Commands Required** - AI understands intent
✅ **Event-Driven Architecture** - Loose coupling via EventBus
✅ **Real-Time Streaming** - Progressive response display
✅ **Type-Safe** - Full TypeScript with strict typing
✅ **Free Tier** - 14,400 requests/day with Groq

## What Makes This Special

Unlike traditional chatbots with hardcoded commands, this app:

1. **Uses AI to understand intent**
   - No `if (message === 'close sidebar')` needed
   - Works with any phrasing

2. **Function calling / Tool use**
   - AI returns structured JSON
   - Defines tools with schemas
   - Automatically learns new tools

3. **Event-driven execution**
   - Tools emit events via EventBus
   - Components subscribe to events
   - Loose coupling, high scalability

## Troubleshooting

### "Invalid API key"
- Make sure key starts with `gsk_`
- Copy the entire key (no spaces)
- Get a new key from https://console.groq.com/keys

### Sidebar not closing
- Check browser console for event logs
- Look for `[EventBus] SIDEBAR_TOGGLE` messages
- Verify AI returned a tool call (check Network tab)

### No response from AI
- Check Groq API status: https://status.groq.com/
- Verify API key is valid
- Check rate limits (30 req/min free tier)

## Learn More

- **[FUNCTION_CALLING.md](./FUNCTION_CALLING.md)** - How AI tool use works
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[README.md](./README.md)** - Full documentation

## Next Steps

1. **Try different phrasings** - See how flexible the AI is
2. **Check the console** - Watch EventBus events flow
3. **Read the docs** - Understand the architecture
4. **Add your own tools** - Extend with new actions

Enjoy building with AI-driven events! 🚀
