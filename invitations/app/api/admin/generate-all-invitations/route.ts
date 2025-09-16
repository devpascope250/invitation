// import { sendEmail } from "@/lib/email";
// import prisma from "@/lib/prisma";
// import { NextResponse, NextRequest } from "next/server";

// export async function POST(request: NextRequest) {
//   const getEmail = await prisma.invitationCard.findMany({
//     select: { email: true },
//     take: 500,
//   });

//   if (getEmail.length === 0) {
//     return NextResponse.json({ message: "No email found" });
//   }

//   const subject = "Invitation to join the community";
//   const text =
//     "Hello, you have been invited to join the community. Please click on the link below to accept the invitation. https://www.google.com";
//   const html = `<h1>${text}</h1>`;

//   // Batch emails (50 at a time)
//   const batchSize = 50;
//   for (let i = 0; i < getEmail.length; i += batchSize) {
//     const batch = getEmail.slice(i, i + batchSize);

//     const results = await Promise.allSettled(
//       batch.map((item) =>
//         item.email ? sendEmail(item.email, subject, text, html) : null
//       )
//     );

//     console.log(`✅ Batch ${i / batchSize + 1} done`, results);

//     // Optional: delay between batches (avoid throttling)
//     await new Promise((res) => setTimeout(res, 2000));
//   }

//   return NextResponse.json({ message: "500 invitations processed" });
// }






import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import ejs from 'ejs';
import path from 'path';

export async function POST(request: NextRequest) {
  const getEmail = await prisma.invitationCard.findMany({
    where: {
      status: "IDLE"
    },
    select: { email: true, id: true, origanization: true, fullName: true },
    take: 500,
  });

  if (getEmail.length === 0) {
    return NextResponse.json({ message: "No email found" });
  }

  // Batch emails (50 at a time)
  const batchSize = 50;
  for (let i = 0; i < getEmail.length; i += batchSize) {
    const batch = getEmail.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(async (item) => {
        if (!item.email) return null;
        
        // Render the EJS template with unique data
        const templatePath = path.join(process.cwd(), 'views', 'emails', 'guest-invitaion-template.ejs');
        const html = await ejs.renderFile(templatePath, {
          companyName: item.origanization ?? item.fullName,
          rsvpLink: process.env.RSVP_LINK+''+item.id,
        });

        const subject = "Invitation to University of Rwanda 2025 Graduation Ceremony";
        const text = "Your organization is invited to attend the 2025 Graduation Ceremony of University of Rwanda. Please visit our website for details and to RSVP.";

        await sendEmail(item.email, subject, text, html);
        // update 
        //  update the status of the invitation to "sent"
          await prisma.invitationCard.update({
            where: {
              id: item.id,
            },
            data: {
              status: "GENERATED",
              approval: "PENDING"
            },
          });
      })
    );

    console.log(`✅ Batch ${i / batchSize + 1} done`, results);

    // Optional: delay between batches (avoid throttling)
    await new Promise((res) => setTimeout(res, 2000));
  }

  return NextResponse.json({ message: "500 invitations processed" });
}