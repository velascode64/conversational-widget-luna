import { useMutation } from "@tanstack/react-query";
import { createStreamableValue } from "@/lib/streaming";
import { sendMessageToN8n } from "../n8n/api";

interface ChatCompletionParams {
  conversationId: string | null | undefined;
  content: string | null | undefined;
}

async function completionStreamN8n({
  conversationId,
  content,
}: ChatCompletionParams) {
  if (!conversationId || !content) {
    throw new Error("Missing required parameters");
  }

  const response = await sendMessageToN8n(content, conversationId);

  const fakeStreamResponse = new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = response.output.split(' ');

        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        controller.close();
      },
    })
  );

  const streamableValue = createStreamableValue(fakeStreamResponse);
  return streamableValue;
}

export function useCompletionStreamN8n() {
  return useMutation({
    mutationFn: completionStreamN8n,
  });
}