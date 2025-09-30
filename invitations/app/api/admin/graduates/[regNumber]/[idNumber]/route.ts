import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ regNumber: string, idNumber: string }> }) {
    const { regNumber, idNumber } = await params;
    const graduates = await prisma.graduation_student.findFirst({
        where: {
            regNumber: regNumber,
            id: parseInt(idNumber)
        }
    });


    const getInvitations = await prisma.invitationCard.findMany({
        where: {
            regNumber: regNumber,
        }
    });

    if (!graduates) {
        return NextResponse.json({ message: "Graduate not found" }, { status: 404 });
    }


    const newGraduants = {
        id: graduates?.id,
        collegeName: graduates?.collegeName,
        regNumber: graduates?.regNumber,
        firstName: graduates?.firstName,
        lastName: graduates?.lastName,
        degree: graduates?.degree,
        scannedNumber: graduates?.scannedNumber,
        status: graduates?.status,
        createdAt: graduates?.createdAt,
        updatedAt: graduates?.updatedAt,
        invitations: getInvitations
    }

    return NextResponse.json(newGraduants, {status: 200});
}

// 