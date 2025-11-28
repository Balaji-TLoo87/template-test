// Available tools/functions that the AI can call
export const availableTools = [
  {
    type: 'function',
    function: {
      name: 'toggle_sidebar',
      description: 'Open or close the sidebar menu. Use this when the user asks to show/hide/open/close the sidebar or menu.',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['open', 'close'],
            description: 'Whether to open or close the sidebar',
          },
        },
        required: ['action'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'clear_chat',
      description: 'Clear all messages from the chat history. Use this when the user asks to clear, reset, or start a new conversation.',
      parameters: {
        type: 'object',
        properties: {
          confirm: {
            type: 'boolean',
            description: 'Confirmation to clear the chat',
          },
        },
        required: ['confirm'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'change_theme',
      description: 'Change the app theme between light and dark mode. Use this when the user asks to switch theme, enable dark mode, or change appearance.',
      parameters: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            enum: ['light', 'dark', 'toggle'],
            description: 'The theme to switch to, or "toggle" to switch between them',
          },
        },
        required: ['theme'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to_page',
      description: 'Navigate to a different page in the app. Use this when the user wants to open/go to/view settings, form, or chat pages (full page navigation).',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: ['chat', 'settings', 'form'],
            description: 'Which page to navigate to. chat=home page, settings=settings page, form=form page.',
          },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'open_split_view',
      description: 'Open a page in split view alongside the chat. Use this when the user specifically mentions "split view" or wants to see a page while staying on chat.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: ['settings', 'form', 'none'],
            description: 'Which page to open in split view. Use "none" to close the split view.',
          },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'fill_form',
      description: 'Fill in the contact form fields with provided data. Use this when the user wants to add/enter information into the form (name, email, message).',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name to fill in the form',
          },
          email: {
            type: 'string',
            description: 'The email address to fill in the form',
          },
          message: {
            type: 'string',
            description: 'The message content to fill in the form',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'resize_sidebar',
      description: 'Change the width/size of the sidebar. Use this when the user wants to make the sidebar bigger, smaller, wider, or narrower.',
      parameters: {
        type: 'object',
        properties: {
          size: {
            type: 'string',
            enum: ['small', 'medium', 'large'],
            description: 'The size to set the sidebar. small=narrow (16rem), medium=default (20rem), large=wide (24rem)',
          },
        },
        required: ['size'],
      },
    },
  },
];

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}
