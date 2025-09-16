/*
  Warnings:

  - The primary key for the `invitation_card` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."invitation_card" DROP CONSTRAINT "invitation_card_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "invitation_card_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "invitation_card_id_seq";
