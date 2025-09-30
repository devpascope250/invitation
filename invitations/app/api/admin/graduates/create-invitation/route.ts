import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import ejs from "ejs";
import { sendEmail } from "@/lib/email";
export async function POST(request: NextRequest) {
    // get email from query params
    const email = request.nextUrl.searchParams.get("email");    
    const data = await request.json();
    // id exist in invitationCard
    const check = await prisma.invitationCard.findMany({
        where: {
            regNumber: data[0].regNumber
        }
    });
    if (check.length > 0) {
        return NextResponse.json({ message: "id already exist" }, { status: 400 });
    }


    // Render the EJS template with unique data
    const templatePath = path.join(process.cwd(), 'views', 'emails', 'student-invitaion-template.ejs');
    const html = await ejs.renderFile(templatePath, {
        studentName: data[0].fullName,
        rsvpLink: `${process.env.RSVP_LINK_ST}${data[0].regNumber}/download/multiple`,
    });

    const subject = "Invitation to University of Rwanda 2025 Graduation Ceremony";
    const text = "Your organization is invited to attend the 2025 Graduation Ceremony of University of Rwanda. Please visit our website for details and to RSVP.";
    if (!email) {
        return NextResponse.json({ message: "email is required" }, { status: 400 });
    }
    await sendEmail(email, subject, text, html);


    // create many
    await prisma.invitationCard.createMany({
        data: data
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
}