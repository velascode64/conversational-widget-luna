import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { apiKey, chatId, ...restBody } = body;

    if (!apiKey || !chatId) {
      return NextResponse.json(
        { error: 'API key and chat ID are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'N8N base URL not configured' },
        { status: 500 }
      );
    }

    const n8nUrl = baseUrl + chatId;
    const n8nAuth = apiKey;

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': n8nAuth,
      },
      body: JSON.stringify(restBody),
    });

    if (!response.ok) {
      throw new Error(`N8N request failed: ${response.status}`);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('N8N proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}