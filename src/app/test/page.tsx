"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:3000/chat-widget.js";
    script.dataset.apiKey = "test-api-key";
    script.dataset.chatId = "test-chat-id";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="http://localhost:3000/chat-widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      const controlFrame = document.querySelector('iframe[src*="/widget/control"]');
      const chatFrame = document.querySelector('iframe[src*="/widget/chat"]');
      if (controlFrame) controlFrame.remove();
      if (chatFrame) chatFrame.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chat Widget Test Page</h1>
        <p className="text-gray-600 mb-8">
          This is a test page for the Luna chat widget. The widget should appear in the bottom right corner.
        </p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Current Configuration:</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>API Key:</strong> test-api-key</li>
            <li><strong>Chat ID:</strong> test-chat-id</li>
            <li><strong>Widget URL:</strong> http://localhost:3000/chat-widget.js</li>
            <li><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "Not configured"}</li>
          </ul>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
          <p className="text-sm text-purple-700">
            <strong>Test Instructions:</strong> Click on the chat bubble in the bottom right corner to open Luna Assistant.
            Type a message to test the N8N integration.
          </p>
        </div>
      </div>
    </div>
  );
}