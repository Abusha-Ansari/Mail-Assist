import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 300, // 5 minutes
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';

  try {
    await rateLimiter.consume(ip); 
  } catch {
    return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { email, password, name } = body as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Signup successful. Please check your email to confirm.' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
