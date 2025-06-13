import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';

// Handles GET requests to /api/services
// Fetch all services
export async function GET() {
  try {
    // Fetch all services
    const services = await prisma.service.findMany();

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}