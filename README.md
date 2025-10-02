# Luna Chat Widget (Migrated from DoubleO)

A customizable, embeddable chat widget built with Next.js for integrating AI-powered conversations into any website. Originally built for DoubleO, this widget has been migrated to use n8n workflow automation for Luna Physical Therapy's customer support chatbot. The widget provides a floating chat interface with real-time message streaming and responsive design.

## Features

- 🎨 **Customizable styling** - Configure primary and secondary colors
- 📱 **Responsive design** - Works seamlessly on mobile and desktop
- ⚡ **Real-time streaming** - Live AI responses with streaming text
- 🖼️ **Iframe-based isolation** - Secure, isolated widget implementation
- 🎯 **Easy integration** - Simple JavaScript snippet for embedding
- 📝 **Markdown support** - Rich text formatting in messages

## Architecture Overview

### Migration from DoubleO to n8n

This project has been successfully migrated from the DoubleO chat platform to n8n workflow automation. The migration enables:

- **Self-hosted workflow management** - Full control over conversation flows and integrations
- **Visual workflow builder** - Easy modification of chat logic without code changes
- **Webhook-based communication** - Real-time message processing via n8n webhooks
- **Advanced AI capabilities** - Integration with OpenAI GPT models and Qdrant vector store for knowledge base
- **Custom tools and MCP clients** - Extended functionality for insurance verification and service coverage checks

### n8n Workflow Components

The n8n workflow (`packages/n8n-luna-agent/luna_chat.json`) implements:

1. **Webhook Endpoints**
   - Frontend webhook (`/webhook/4c44d7e1-cae5-4b26-853b-ae109d20a67d`) - Receives messages from the chat widget
   - Chat trigger for interactive conversations

2. **AI Agent with Memory**
   - OpenAI GPT-4.1-mini model for natural language processing
   - Session-based memory management with 10-message context window
   - Custom system prompts for Luna Physical Therapy's virtual care coordinator

3. **Knowledge Base Integration**
   - Qdrant vector store for FAQ retrieval
   - OpenAI embeddings for semantic search
   - Intelligent tool usage based on query type

4. **Custom Tools**
   - `check_insurance_coverage` - JavaScript tool for real-time insurance verification
   - MCP Client integrations for service coverage checks
   - ZIP code validation for appointment booking

5. **Response Handling**
   - Webhook response node for sending messages back to the widget
   - Structured JSON responses with booking actions and follow-up prompts

## Installation

### For Website Integration

Add the following script tag to your website where you want the chat widget to appear:

```html
<script
  src="https://your-domain.com/chat-widget.js"
  data-webhook-url="https://neowork.app.n8n.cloud/webhook/4c44d7e1-cae5-4b26-853b-ae109d20a67d"
  data-auth-header="Basic bHVuYTpsdW5hMjAyNQ=="
  async>
</script>
```

Replace:
- `https://your-domain.com` with your deployed widget domain (recommended: Vercel)
- Update webhook URL if using a different n8n instance
- Configure authentication header for your n8n webhook security

3. Configure environment variables:

Create a `.env` file in the root directory with:

```env
# n8n Webhook Configuration

```

4. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Widget Customization

The widget supports the following customization options:

- **Primary Color**: Main accent color for buttons and active elements (default: `#000000`)
- **Secondary Color**: Background color for the widget (default: `#fefcf8`)



### n8n Workflow Requirements

The widget requires:
- n8n instance with the Luna chatbot workflow imported (`packages/n8n-luna-agent/luna_chat.json`)
- Configured credentials for:
  - OpenAI API (GPT-4.1-mini model access)
  - Qdrant vector database
  - MCP Client authentication headers
- Active webhook endpoints with proper CORS configuration

## Usage

Once embedded, the widget will:

1. Display a floating chat button in the bottom-right corner
2. Open a chat interface when clicked
3. Support real-time conversations with AI
4. Automatically handle message streaming and formatting
5. Provide responsive design across devices

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── widget/
│   │   ├── chat/          # Chat widget iframe page
│   │   └── control/       # Control button iframe page
├── components/            # Reusable UI components
├── lib/                   # Utilities and API integration
├── usecases/             # Chat widget implementation
│   └── chat-widget/
│       ├── components/   # Widget-specific components
│       ├── hooks/        # Custom hooks for widget logic
│       └── lib/          # Widget constants and utilities
public/
└── chat-widget.js        # Embeddable JavaScript widget script
```


### Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Data fetching and caching
- **React Markdown** - Markdown rendering support

## Deployment

### Recommended: Vercel Deployment

This widget is optimized for deployment on Vercel:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build and deploy:
```bash
npm run build
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env` file
   - Redeploy for changes to take effect

### n8n Workflow Setup

1. Import the workflow:
   - Open your n8n instance
   - Go to Workflows → Import
   - Upload `packages/n8n-luna-agent/luna_chat.json`

2. Configure credentials:
   - OpenAI API: Add your OpenAI API key
   - Qdrant: Configure vector database connection
   - MCP Headers: Set up authentication for Luna services

3. Activate the workflow:
   - Click "Activate" to enable webhook endpoints
   - Test webhook connectivity from the widget

4. Update widget configuration:
   - Ensure the `chat-widget.js` file is accessible at `/chat-widget.js`
   - Update embed script with your Vercel domain and n8n webhook URL

## How the n8n Integration Works

### Message Flow

1. **User Input**: User types a message in the chat widget
2. **Webhook Request**: Widget sends POST request to n8n webhook with:
   - `message`: User's text
   - `sessionId`: Unique session identifier for conversation continuity
3. **AI Processing**: n8n workflow processes the message:
   - Retrieves conversation history from memory buffer
   - Analyzes query type to determine tool usage
   - Searches knowledge base if needed
   - Generates contextual response
4. **Tool Execution**: Based on user intent, executes:
   - Insurance coverage verification
   - ZIP code service area checks
   - Appointment booking flow initiation
5. **Response Delivery**: Formatted response sent back to widget
   - Includes message text, booking actions, and follow-up prompts

### Key Features

- **Intelligent Tool Selection**: AI agent determines when to use vector search vs. built-in knowledge
- **Session Management**: Maintains conversation context across multiple messages
- **Multi-step Workflows**: Guides users through insurance verification and booking processes
- **Fallback Handling**: Gracefully handles unknown queries with escalation to human support
- **Real-time Processing**: Webhook-based architecture ensures instant responses
