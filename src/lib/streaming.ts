export type StreamableValue = AsyncGenerator<string, void, unknown>;

export async function* createStreamableValue(
  response: Response
): StreamableValue {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const readOutput = await reader?.read();

    if (readOutput?.done) {
      break;
    }

    const decoded = decoder.decode(readOutput?.value, { stream: true });
    yield decoded;
  }
}
