import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, {params: params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const {fullName, email, phoneNumber, origanization, position, idNumber} = await request.json();    
    const invitation = await prisma.invitationCard.update({
        where: {
            id: id
        },
        data: {
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            origanization: origanization,
            position: position,
            idNumber: idNumber.toString()
        }
    });
    return NextResponse.json(invitation);
    
}