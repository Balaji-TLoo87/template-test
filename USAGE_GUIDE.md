# Usage Guide - Event-Driven AI Chat

## 🚀 Quick Start

```bash
npm run dev
```

Open http://localhost:3000

## 📱 Pages Overview

### 1. Chat Page (Main - /)

**What it does:**
- AI-powered chat using Groq's Llama 3.3 70B
- Real-time streaming responses
- Function calling for UI control
- Sidebar navigation

**How to use:**
1. Enter your Groq API key on first visit
2. Type messages to chat with AI
3. Try commands: "close the sidebar", "clear chat"
4. Toggle sidebar with hamburger menu (☰)

**Event-driven features:**
- `USER_MESSAGE_SENT` - When you send a message
- `AI_RESPONSE_CHUNK` - AI streams response
- `TOOL_CALL` - AI controls UI via tools
- `SIDEBAR_TOGGLE` - Show/hide sidebar

---

### 2. Form Page (/form)

**What it does:**
- Auto-submit contact form
- Real-time form tracking
- Submission history
- Event-driven processing

**How to use:**
1. Click "📝 Form" in sidebar
2. Enable "Auto-submit" checkbox (optional)
3. Fill in fields:
   - Name
   - Email
   - Message
4. **With auto-submit**: Form submits automatically after 1s
5. **Without auto-submit**: Click "Submit Form" button
6. See your submission appear in the history panel

**Event-driven features:**
- `FORM_SUBMIT` - When form is submitted
- Form data emitted via EventBus
- Subscribers can process form data

**Try it:**
```typescript
// Subscribe to form submissions
eventBus.subscribe('FORM_SUBMIT', (payload) => {
  console.log('Form submitted:', payload.formData);
});
```

---

### 3. Settings Page (/settings)

**What it does:**
- Toggle between light and dark mode
- Manage API key
- View app information

**How to use:**
1. Click "⚙️ Settings" in sidebar
2. Click theme toggle to switch dark/light mode
3. Theme persists across page reloads
4. Clear API key if needed

**Event-driven features:**
- `THEME_CHANGE` - When theme switches
- Theme stored in localStorage
- All pages update automatically

**Theme Toggle:**
```
☀️ Light Mode → [Toggle] → 🌙 Dark Mode
```

---

## 🎨 Dark Mode

### Automatic Theme Switching

**Via Settings Page:**
1. Navigate to Settings
2. Click the theme toggle
3. Watch entire app switch themes

**Via Events (Programmatic):**
```typescript
const eventBus = EventBus.getInstance();

// Switch to dark
eventBus.emit({
  type: 'THEME_CHANGE',
  payload: { theme: 'dark' },
  timestamp: Date.now()
});

// Switch to light
eventBus.emit({
  type: 'THEME_CHANGE',
  payload: { theme: 'light' },
  timestamp: Date.now()
});
```

### What Changes
- Background colors
- Text colors
- Border colors
- Shadow styles
- Sidebar styling
- All interactive elements

---

## 📋 Auto-Submit Form

### Enable Auto-Submit

1. Go to Form page
2. Check "Enable auto-submit" checkbox
3. Fill in all 3 fields
4. Wait 1 second
5. Form auto-submits!

### How It Works

```
User types in field
     ↓
useEffect detects all fields filled
     ↓
Set timeout (1 second)
     ↓
Auto-submit fires
     ↓
FORM_SUBMIT event emitted
     ↓
Form resets
     ↓
Submission added to history
```

### Manual Submit

1. Uncheck "Enable auto-submit"
2. Fill in fields
3. Click "Submit Form" button
4. Same event flow, manual trigger

### Submission History

- Shows all submissions
- Timestamp for each
- Form type label
- Name, email, message displayed
- Scrollable if many submissions

---

## 🎯 Sidebar Navigation

### Opening/Closing

**Method 1: Button**
- Click hamburger menu (☰) in header

**Method 2: AI Command**
- Type: "close the sidebar"
- AI understands and closes it

**Method 3: EventBus**
```typescript
eventBus.emit({
  type: 'SIDEBAR_TOGGLE',
  payload: { isOpen: false },
  timestamp: Date.now()
});
```

### Navigation Links

**💬 Chat** - Main chat interface
- Click to go to home page
- Active when on `/`
- Blue highlight when active

**📝 Form** - Auto-submit form
- Click to go to form page
- Active when on `/form`
- Blue highlight when active

**⚙️ Settings** - App preferences
- Click to go to settings page
- Active when on `/settings`
- Blue highlight when active

### Quick Actions

**🗑️ Clear Chat**
- Clears all messages
- Emits `CLEAR_CHAT` event
- Confirmation dialog

**🔑 Change API Key**
- Clears stored API key
- Redirects to key input
- Confirmation dialog

**🔄 Refresh Chat**
- Reloads the page
- Fresh start

---

## 🎪 Event-Driven Features

### All Available Events

```typescript
// Chat events
USER_MESSAGE_SENT
AI_RESPONSE_REQUESTED
AI_RESPONSE_CHUNK
AI_RESPONSE_COMPLETE
AI_RESPONSE_ERROR

// UI control events
SIDEBAR_TOGGLE
CLEAR_CHAT

// Tool/function call events
TOOL_CALL

// Theme events
THEME_CHANGE

// Form events
FORM_SUBMIT
```

### Subscribe to Events

```typescript
const eventBus = EventBus.getInstance();

// Example: Log all form submissions
const unsubscribe = eventBus.subscribe(
  'FORM_SUBMIT',
  (payload) => {
    console.log('Form:', payload.formData);
  }
);

// Cleanup
useEffect(() => {
  return unsubscribe;
}, []);
```

### Emit Events

```typescript
// Toggle sidebar
eventBus.emit({
  type: 'SIDEBAR_TOGGLE',
  payload: { isOpen: true },
  timestamp: Date.now()
});

// Change theme
eventBus.emit({
  type: 'THEME_CHANGE',
  payload: { theme: 'dark' },
  timestamp: Date.now()
});

// Submit form programmatically
eventBus.emit({
  type: 'FORM_SUBMIT',
  payload: {
    formData: { name: 'John', email: 'john@test.com', message: 'Hi' },
    formType: 'contact'
  },
  timestamp: Date.now()
});
```

---

## 💡 Tips & Tricks

### 1. Quick Theme Switch
- Press `Cmd/Ctrl + K` in Settings page (future feature)
- Or use AI command: "switch to dark mode"

### 2. Form Shortcuts
- Tab through fields quickly
- Enter to submit (if all fields filled)
- Auto-submit saves time

### 3. Sidebar Management
- Keep open while navigating
- Close for full-width chat
- Use AI to control: "hide the menu"

### 4. Chat Commands
Try these with the AI:
- "close the sidebar"
- "open the menu"
- "clear the chat"
- "show me the settings"

### 5. Debug Events
Open browser console to see:
```
[EventBus] THEME_CHANGE { theme: 'dark' }
[EventBus] FORM_SUBMIT { formData: {...} }
[EventBus] SIDEBAR_TOGGLE { isOpen: false }
```

---

## 🐛 Troubleshooting

### Theme not persisting
- Check localStorage in DevTools
- Look for `theme` key
- Value should be 'light' or 'dark'

### Form not auto-submitting
- Ensure all 3 fields are filled
- Check "Enable auto-submit" is checked
- Wait full 1 second after last keystroke

### Sidebar not closing
- Check EventBus logs in console
- Verify `SIDEBAR_TOGGLE` event fired
- Try manual close button (X)

### Dark mode not applying
- Check `<html>` tag has `dark` class
- Verify Tailwind config has `darkMode: 'class'`
- Check console for errors

---

## 📚 Learn More

- **[FUNCTION_CALLING.md](./FUNCTION_CALLING.md)** - How AI controls UI
- **[FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)** - All new features
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[README.md](./README.md)** - Main documentation

---

## 🎉 Have Fun!

Explore the event-driven architecture, try different features, and see how everything connects through the EventBus! 🚀
