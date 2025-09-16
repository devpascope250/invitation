import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const totalIn = await prisma.invitationCard.count();
  const generated = await prisma.invitationCard.count({
    where: {
      status: "GENERATED",
    },
  });
  const pending = await prisma.invitationCard.count({
    where: {
      status: "GENERATED",
      approval: "PENDING"
    },
  });
  const approved = await prisma.invitationCard.count({
    where: {
      approval: "APPROVED"
    },
  });

  return NextResponse.json({
    totalIn,
    generated,
    pending,
    approved,
  });
}
