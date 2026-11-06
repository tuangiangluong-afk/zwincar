import { NextResponse } from 'next/server';

export async function GET() {
    // IndexNow verification key
    // This key proves ownership of the domain
    const key = "451408f3764b4c80b96839be70de0056";
    return new NextResponse(key, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
