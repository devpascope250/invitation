import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } =  await params;   
  // get id from code invitationId:regNumber
  const invitationId = code.split(":")[0];
  const regNumber = code.split(":")[1];

  const graduate = await prisma.invitationCard.findUnique({
    where: {
      id: invitationId,
    },
  });

  if (!graduate) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
  }

  if(graduate.status === "SCANNED"){
    return NextResponse.json({ message: "Invitation already scanned" }, { status: 400 });
  }

const updateDate = await prisma.invitationCard.update({
    where: {
      id: invitationId,
    },
    data: {
      status: "SCANNED",
    },
  });

const graduateData = {
    id: updateDate.id,
    fullName: graduate.fullName,
    regNumber: graduate.regNumber ?? "",
    email: graduate.email ?? "",
    phoneNumber: graduate.phoneNumber ?? "",
    status: updateDate.status,
    type: updateDate.type,
    position: updateDate.position,
    origanization: updateDate.origanization,
    createdAt: updateDate.dateScanned,

    
}

  return NextResponse.json({ message: "Graduate found", graduate: graduateData }, { status: 200
  });
}