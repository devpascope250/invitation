import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, {params: params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const {approval} = await request.json();   
    // check if exist
    const existinvitation = await prisma.invitationCard.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!existinvitation) {
        return NextResponse.json({message: "Invitation not found"}, {status: 404
    })
}
    const invitation = await prisma.invitationCard.update({
        where: {
            id: parseInt(id)
        },
        data: {
            approval: approval
        }
    });
    return NextResponse.json(invitation);
    
}