import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server processing request failed';
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
