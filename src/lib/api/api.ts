export async function chatWidgetApi(url: string, init?: RequestInit) {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...init?.headers,
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...init,
    headers,
  });

  return response;
}
