import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma';


export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const param = await params;
    const id = param.id;
    
    const user = await prisma.invitationCard.findUnique({
        where: {
            id: id
        },
    }
);
    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}