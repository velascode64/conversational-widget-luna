export interface N8nChatRequest {
  message: string;
  sessionId: string;
}

export interface N8nChatResponse {
  output: string;
}

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  'https://neowork.app.n8n.cloud/webhook/4c44d7e1-cae5-4b26-853b-ae109d20a67d';

const N8N_AUTH_HEADER = process.env.NEXT_PUBLIC_N8N_AUTH ||
  'Basic bHVuYTpsdW5hMjAyNQ==';

export async function sendMessageToN8n(
  message: string,
  sessionId: string
): Promise<N8nChatResponse> {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': N8N_AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId,
    } as N8nChatRequest),
  });

  if (!response.ok) {
    throw new Error(`N8n webhook error: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0) {
    return { output: data[0].output };
  }

  return { output: data.output || '' };
}

export async function streamMessageToN8n(
  message: string,
  sessionId: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await sendMessageToN8n(message, sessionId);

  const chunks = response.output.split(' ');
  for (const chunk of chunks) {
    onChunk(chunk + ' ');
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}