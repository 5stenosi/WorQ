import { prisma } from '@/lib/prisma'

// Handles GET requests to /api/services
// Fetch all services
export async function GET() {
  try {
    // Fetch all services
    const services = await prisma.service.findMany();

    return new Response(JSON.stringify(services), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}