-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('STUDENT', 'PARENT', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('IDLE', 'GENERATED');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('IDLE', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."graduation_student" (
    "id" INTEGER NOT NULL,
    "regNumber" TEXT,
    "collegeName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "degree" TEXT,
    "status" TEXT,
    "scannedNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graduation_student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invitation_card" (
    "id" SERIAL NOT NULL,
    "regNumber" TEXT,
    "Image" TEXT,
    "secretKey" TEXT,
    "fullName" TEXT,
    "position" TEXT,
    "email" TEXT,
    "idNumber" TEXT,
    "phoneNumber" TEXT,
    "origanization" TEXT,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'IDLE',
    "approval" "public"."ApprovalStatus" NOT NULL DEFAULT 'IDLE',
    "type" "public"."Type",
    "dateGenerated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateScanned" TIMESTAMP(3),
    "entranceUserId" INTEGER,

    CONSTRAINT "invitation_card_pkey" PRIMARY KEY ("id")
);
