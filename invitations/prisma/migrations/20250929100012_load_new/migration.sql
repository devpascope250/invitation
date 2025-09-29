-- AlterTable
ALTER TABLE `invitation_card` MODIFY `status` ENUM('IDLE', 'GENERATED', 'SCANNED') NOT NULL DEFAULT 'IDLE';
