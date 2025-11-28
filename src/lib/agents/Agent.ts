import EventBus from '../eventbus/EventBus';
import type { AppEvent } from '../eventbus/types';
import { availableTools, type ToolCall } from './tools';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

class GeminiAgent {
  private eventBus: EventBus;
  private conversationHistory: ConversationMessage[];

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.conversationHistory = [];
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for AI response requests
    this.eventBus.subscribe('AI_RESPONSE_REQUESTED', async (payload) => {
      await this.handleGenerateResponse(payload);
    });
  }

  private async executeTool(toolName: string, args: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'toggle_sidebar':
        // Emit sidebar toggle event
        this.eventBus.emit<AppEvent>({
          type: 'SIDEBAR_TOGGLE',
          payload: {
            isOpen: args.action === 'open',
          },
          timestamp: Date.now(),
        });
        return { success: true, action: args.action };

      case 'clear_chat':
        // Emit clear chat event
        if (args.confirm) {
          this.eventBus.emit<AppEvent>({
            type: 'CLEAR_CHAT',
            payload: {
              confirm: true,
            },
            timestamp: Date.now(),
          });
          this.conversationHistory = [];
          return { success: true, message: 'Chat cleared' };
        }
        return { success: false, message: 'Clear cancelled' };

      case 'change_theme':
        // Emit theme change event
        let targetTheme = args.theme;

        // If toggle, we'll emit and let ThemeProvider handle the logic
        if (targetTheme === 'toggle') {
          // Get current theme from localStorage
          const currentTheme = typeof window !== 'undefined'
            ? localStorage.getItem('theme') || 'light'
            : 'light';
          targetTheme = currentTheme === 'light' ? 'dark' : 'light';
        }

        this.eventBus.emit<AppEvent>({
          type: 'THEME_CHANGE',
          payload: {
            theme: targetTheme as 'light' | 'dark',
          },
          timestamp: Date.now(),
        });
        return { success: true, theme: targetTheme };

      case 'navigate_to_page':
        // Emit page navigation event
        this.eventBus.emit<AppEvent>({
          type: 'PAGE_NAVIGATE',
          payload: {
            page: args.page as 'chat' | 'settings' | 'form',
          },
          timestamp: Date.now(),
        });
        return { success: true, page: args.page };

      case 'open_split_view':
        // Emit split view toggle event
        this.eventBus.emit<AppEvent>({
          type: 'SPLIT_VIEW_TOGGLE',
          payload: {
            page: args.page as 'settings' | 'form' | 'none',
            isOpen: args.page !== 'none',
          },
          timestamp: Date.now(),
        });
        return { success: true, page: args.page, isOpen: args.page !== 'none' };

      case 'fill_form':
        // Emit form fill event
        this.eventBus.emit<AppEvent>({
          type: 'FORM_FILL',
          payload: {
            name: args.name,
            email: args.email,
            message: args.message,
          },
          timestamp: Date.now(),
        });
        return { success: true, filled: Object.keys(args).length };

      case 'resize_sidebar':
        // Emit sidebar resize event
        this.eventBus.emit<AppEvent>({
          type: 'SIDEBAR_RESIZE',
          payload: {
            size: args.size as 'small' | 'medium' | 'large',
          },
          timestamp: Date.now(),
        });
        return { success: true, size: args.size };

      default:
        return { success: false, error: 'Unknown tool' };
    }
  }

  private async handleGenerateResponse(payload: {
    message: string;
    messageId: string;
    apiKey: string;
  }) {
    try {
      // Validate API key format
      if (!payload.apiKey || payload.apiKey.trim().length < 10) {
        throw new Error('Invalid API key. Please enter a valid OpenRouter API key.');
      }

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: payload.message,
      });

      // Call OpenRouter API with streaming and tools
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${payload.apiKey.trim()}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'Event-Driven Chat',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: this.conversationHistory,
          tools: availableTools,
          tool_choice: 'auto',
          stream: true,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response stream');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';
      let toolCalls: ToolCall[] = [];
      let currentToolCall: Partial<ToolCall> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta;

              // Handle text content
              const content = delta?.content;
              if (content) {
                fullResponse += content;

                this.eventBus.emit<AppEvent>({
                  type: 'AI_RESPONSE_CHUNK',
                  payload: {
                    chunk: content,
                    messageId: payload.messageId,
                  },
                  timestamp: Date.now(),
                });
              }

              // Handle tool calls
              if (delta?.tool_calls) {
                for (const toolCallDelta of delta.tool_calls) {
                  if (toolCallDelta.index !== undefined) {
                    if (!currentToolCall || toolCallDelta.index > (toolCalls.length - 1)) {
                      currentToolCall = {
                        id: toolCallDelta.id,
                        type: 'function',
                        function: {
                          name: toolCallDelta.function?.name || '',
                          arguments: toolCallDelta.function?.arguments || '',
                        },
                      };
                      toolCalls.push(currentToolCall as ToolCall);
                    } else {
                      // Append to existing tool call
                      const existingCall = toolCalls[toolCallDelta.index];
                      if (toolCallDelta.function?.arguments) {
                        existingCall.function.arguments += toolCallDelta.function.arguments;
                      }
                    }
                  }
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Process tool calls if any
      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          try {
            const args = JSON.parse(toolCall.function.arguments);

            // Emit tool call event
            this.eventBus.emit<AppEvent>({
              type: 'TOOL_CALL',
              payload: {
                toolName: toolCall.function.name,
                arguments: args,
                messageId: payload.messageId,
              },
              timestamp: Date.now(),
            });

            // Execute tool and get result
            const toolResult = await this.executeTool(toolCall.function.name, args);

            // Add tool call and result to history
            this.conversationHistory.push({
              role: 'assistant',
              content: fullResponse || '',
              tool_calls: [toolCall],
            });

            this.conversationHistory.push({
              role: 'tool',
              content: JSON.stringify(toolResult),
              tool_call_id: toolCall.id,
              name: toolCall.function.name,
            });

            // If there's additional response needed, make another API call
            // For now, just complete with tool execution message
            if (!fullResponse) {
              fullResponse = `I've ${toolCall.function.name.replace('_', ' ')} for you.`;

              this.eventBus.emit<AppEvent>({
                type: 'AI_RESPONSE_CHUNK',
                payload: {
                  chunk: fullResponse,
                  messageId: payload.messageId,
                },
                timestamp: Date.now(),
              });
            }
          } catch (e) {
            console.error('Error executing tool:', e);
          }
        }
      }

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
      });

      // Emit completion event
      this.eventBus.emit<AppEvent>({
        type: 'AI_RESPONSE_COMPLETE',
        payload: {
          fullResponse,
          messageId: payload.messageId,
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      // Emit error event
      this.eventBus.emit<AppEvent>({
        type: 'AI_RESPONSE_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
          messageId: payload.messageId,
        },
        timestamp: Date.now(),
      });
    }
  }
}

export default GeminiAgent;
