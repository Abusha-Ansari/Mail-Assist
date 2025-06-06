import { rateLimiter } from './rateLimiter'
import { NextResponse } from 'next/server'

export async function withRateLimit(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  try {
    await rateLimiter.consume(ip)
    return null // no error, proceed normally
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}