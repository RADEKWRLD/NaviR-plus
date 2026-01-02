import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      valid: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      },
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
