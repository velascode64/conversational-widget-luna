import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    const n8nAuth = process.env.NEXT_PUBLIC_N8N_AUTH;

    if (!n8nUrl || !n8nAuth) {
      return NextResponse.json(
        { error: 'N8N configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': n8nAuth,
      },
      body: JSON.stringify(body),
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