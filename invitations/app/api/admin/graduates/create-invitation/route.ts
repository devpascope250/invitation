import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    // id exist in invitationCard
    const check = await prisma.invitationCard.findMany({
        where: {
            regNumber: data[0].regNumber
        }
    });
    if (check.length > 0) {
        return NextResponse.json({message: "id already exist"}, { status: 400});
    }
    
    // create many
    await prisma.invitationCard.createMany({
        data: data
    });
    return NextResponse.json({message: "success"}, { status: 200 });
}