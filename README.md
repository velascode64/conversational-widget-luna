# Doubleo Chat Widget

A customizable, embeddable chat widget built with Next.js for integrating AI-powered conversations into any website. The widget provides a floating chat interface with real-time message streaming and responsive design.

## Features

- 🎨 **Customizable styling** - Configure primary and secondary colors
- 📱 **Responsive design** - Works seamlessly on mobile and desktop
- ⚡ **Real-time streaming** - Live AI responses with streaming text
- 🖼️ **Iframe-based isolation** - Secure, isolated widget implementation
- 🎯 **Easy integration** - Simple JavaScript snippet for embedding
- 📝 **Markdown support** - Rich text formatting in messages

## Installation

### For Website Integration

Add the following script tag to your website where you want the chat widget to appear:

```html
<script 
  src="https://your-domain.com/chat-widget.js"
  data-api-key="your-api-key"
  data-chat-id="your-chat-id"
  async>
</script>
```

Replace:
- `https://your-domain.com` with your deployed widget domain
- `your-api-key` with your doubleo API key
- `your-chat-id` with your specific chat configuration ID

### For Development

1. Clone the repository:
```bash
git clone <repository-url>
cd doubleo-chat-widget
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Widget Customization

The widget supports the following customization options:

- **Primary Color**: Main accent color for buttons and active elements (default: `#000000`)
- **Secondary Color**: Background color for the widget (default: `#fefcf8`)

### API Requirements

The widget requires:
- A valid API key for authentication
- A chat ID identifying the specific chat configuration
- Access to the doubleo chat API endpoints

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

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Data fetching and caching
- **React Markdown** - Markdown rendering support

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

3. Ensure the `chat-widget.js` file is accessible at `/chat-widget.js`

4. Update your embed script to point to your deployed domain
