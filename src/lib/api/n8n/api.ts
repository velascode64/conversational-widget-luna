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
  // Usar proxy interno en producción para evitar ERR_BLOCKED_BY_CLIENT
  const isProduction = typeof window !== 'undefined' && window.location.origin.includes('vercel');
  const apiUrl = isProduction ? '/api/n8n-proxy' : N8N_WEBHOOK_URL;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Solo agregar auth si no usamos proxy
  if (!isProduction) {
    headers['Authorization'] = N8N_AUTH_HEADER;
  }

  console.log('Sending to:', apiUrl, 'isProduction:', isProduction);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      sessionId,
    } as N8nChatRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('N8N API Error:', response.status, errorText);
    throw new Error(`N8n webhook error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('N8N Response:', data);

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

/**
 * Obtiene el mensaje de bienvenida del bot N8N sin crear una conversación persistente
 * Esta función se usa solo para obtener el saludo inicial
 */
export async function getWelcomeMessageFromN8n(): Promise<string> {
  try {
    // Usar un sessionId temporal solo para obtener la bienvenida
    const tempSessionId = `welcome-${Date.now()}`;

    const response = await sendMessageToN8n("Welcome message", tempSessionId);

    return response.output || "👋 Hello! How can I help you today?";
  } catch (error) {
    console.error('Error getting welcome message from N8n:', error);
    // Fallback en caso de error
    return "👋 Hello! How can I help you today?";
  }
}