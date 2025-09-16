import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import ejs from 'ejs'
import path from "path";
export async function POST(request: NextRequest) {
  const invitation = await request.json();
  const { id } = invitation;
  
  const getEmail = await prisma.invitationCard.findFirst({
    where: {
      id: id,
    },
    select: {
      email: true,
      approval: true,
      fullName: true,
      id: true,
      origanization: true,
      position: true,
      status: true,
      idNumber: true,
      phoneNumber: true,
      type: true
    }
  })

  if (!getEmail) {
    return NextResponse.json({ message: "No email found" });
  }

 const subject = "Invitation to University of Rwanda 2025 Graduation Ceremony";
        const text = "Your organization is invited to attend the 2025 Graduation Ceremony of University of Rwanda. Please visit our website for details and to RSVP.";
  const templatePath = path.join(process.cwd(), 'views', 'emails', 'guest-invitaion-template.ejs');
  const data = {
    rsvpLink: process.env.RSVP_LINK+''+getEmail.id,
    companyName: getEmail.origanization,

  }
  const html = await ejs.renderFile(templatePath, data);

  if(!getEmail.email){
    return NextResponse.json({ message: "No email found" });
  }
  await sendEmail(getEmail.email, subject, text, html);
  // update the status of the invitation to "sent"
  await prisma.invitationCard.update({
    where: {
      id: id,
    },
    data: {
      status: "GENERATED",
      approval: "PENDING"
    },
  });
  return NextResponse.json({ message: "500 invitations processed" });
}
