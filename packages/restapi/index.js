import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// Middleware to log all request details
app.use((req, res, next) => {
  console.log('\n========== REQUEST RECEIVED ==========');
  console.log(`[${new Date().toISOString()}]`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
  }
  console.log('======================================\n');
  next();
});

// Mock API endpoints for the chat widget

// Get chat configuration
app.get('/api/chats/:chatId', (req, res) => {
  const { chatId } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 GET /api/chats/${chatId}`);
  console.log(`🔑 API Key: ${apiKey}`);
  
  res.json({
    id: chatId,
    name: "Test Chat",
    description: "Mock chat for testing",
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 1000,
    welcome_message: "Hello! How can I help you today?",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// Get widget configuration
app.get('/api/chats/:chatId/widget', (req, res) => {
  const { chatId } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 GET /api/chats/${chatId}/widget`);
  console.log(`🔑 API Key: ${apiKey}`);
  
  res.json({
    primaryColor: "#000000",
    secondaryColor: "#fefcf8",
    showWelcomeMessage: true,
    position: "bottom-right",
    buttonText: "Chat with us",
    headerTitle: "Support Chat"
  });
});

// Get welcome message
app.get('/api/chats/:chatId/welcome_message', (req, res) => {
  const { chatId } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 GET /api/chats/${chatId}/welcome_message`);
  console.log(`🔑 API Key: ${apiKey}`);
  
  res.json({
    content: "👋 Welcome! I'm here to help. What can I do for you today?",
    type: "text"
  });
});

// Create a new conversation
app.post('/api/chats/:chatId/conversations', (req, res) => {
  const { chatId } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 POST /api/chats/${chatId}/conversations`);
  console.log(`🔑 API Key: ${apiKey}`);
  
  const conversationId = `conv_${Date.now()}`;
  
  res.json({
    id: conversationId,
    chat_id: chatId,
    created_at: new Date().toISOString(),
    status: "active"
  });
});

// Get conversation messages
app.get('/api/chats/:chatId/conversations/:conversationId/messages', (req, res) => {
  const { chatId, conversationId } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 GET /api/chats/${chatId}/conversations/${conversationId}/messages`);
  console.log(`🔑 API Key: ${apiKey}`);
  
  res.json({
    messages: []
  });
});

// Stream completion endpoint (simulated streaming)
app.post('/api/chats/:chatId/conversations/:conversationId/completion_stream', (req, res) => {
  const { chatId, conversationId } = req.params;
  const { content } = req.body;
  const apiKey = req.headers['x-api-key'];
  
  console.log(`📍 POST /api/chats/${chatId}/conversations/${conversationId}/completion_stream`);
  console.log(`🔑 API Key: ${apiKey}`);
  console.log(`💬 User message: ${content}`);
  
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Simulated response chunks
  const responseChunks = [
    "I received your message: \"",
    content,
    "\". ",
    "This is a mock response ",
    "from the test server. ",
    "The real API would provide ",
    "actual AI-generated responses. ",
    "\n\n",
    "Your request details:\n",
    `- Chat ID: ${chatId}\n`,
    `- Conversation ID: ${conversationId}\n`,
    `- API Key: ${apiKey?.substring(0, 10)}...`
  ];
  
  let index = 0;
  
  // Send chunks with delay to simulate streaming
  const interval = setInterval(() => {
    if (index < responseChunks.length) {
      const chunk = {
        choices: [{
          delta: {
            content: responseChunks[index]
          }
        }]
      };
      
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      index++;
    } else {
      // Send done signal
      res.write(`data: [DONE]\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 100);
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Catch all other endpoints
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled route: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Endpoint not found",
    method: req.method,
    path: req.url
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock REST API Server running on http://localhost:${PORT}`);
  console.log(`📝 Test page available at http://localhost:${PORT}/test.html`);
  console.log(`\n💡 To expose via ngrok, run: ngrok http ${PORT}`);
  console.log(`\n📊 All requests will be logged to the console`);
});