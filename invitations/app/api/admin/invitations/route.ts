import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    // get query params
    const search = request.nextUrl.searchParams.get("search");
    // console.log(search);
    
    // // get all companies
    // const companies = await prisma.graduation_student.findMany(
    //     {
    //         take: 1000
    //     }
    // );
       // invitations

    const invitations = await prisma.invitationCard.findMany(
        {
            where: {
                 regNumber:  search ? search : undefined,
                 type: "GUEST"
            },
            take: 1000
        },
        
    )
    return NextResponse.json(invitations,
        {
            status: 200
        }
    );

 
}
