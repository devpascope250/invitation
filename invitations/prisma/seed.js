/* eslint-disable @typescript-eslint/no-require-imports */
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");
  // delete all from invitationCard
  // await prisma.graduation_student.deleteMany({ });
  // await prisma.invitationCard.deleteMany({ });

  const rawData = fs.readFileSync("prisma/graduation_data.json", "utf-8");
  const data = JSON.parse(rawData);

  // Insert Students in batches
  const students = data.students;
  for (let i = 0; i < students.length; i += 1000) {
    const chunk = students.slice(i, i + 1000);
    // convert createdAt to Date iso and updatedAt to Date iso from chunk
    // chunk.forEach((student) => {
    //   student.createdAt = new Date(student.createdAt).toISOString();
    //   student.updatedAt = new Date(student.updatedAt).toISOString();
    // })
    await prisma.graduation_student.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`Inserted ${i + chunk.length}/${students.length} students`);
  }
   // convert createdAt to Date iso and updatedAt to Date iso from chunk
  const invitations = data.invitations;
  invitations.forEach((invitation) => {
    // invitation.dateGenerated = new Date(invitation.dateGenerated).toISOString();
    // invitation.id = invitation.id+'7440k';
    // invitation.status = 'IDLE';
    // invitation.approval = 'IDLE';
    // invitation.type = 'GUEST';
  })

  // Insert Invitations
  await prisma.invitationCard.createMany({
    data: invitations,
    skipDuplicates: true,
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
