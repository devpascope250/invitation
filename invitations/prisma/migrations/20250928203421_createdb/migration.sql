-- CreateTable
CREATE TABLE `graduation_student` (
    `id` INTEGER NOT NULL,
    `regNumber` VARCHAR(191) NULL,
    `collegeName` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `degree` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `scannedNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation_card` (
    `id` VARCHAR(191) NOT NULL,
    `regNumber` VARCHAR(191) NULL,
    `Image` VARCHAR(191) NULL,
    `secretKey` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `idNumber` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `origanization` VARCHAR(191) NULL,
    `status` ENUM('IDLE', 'GENERATED') NOT NULL DEFAULT 'IDLE',
    `approval` ENUM('IDLE', 'PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'IDLE',
    `type` ENUM('STUDENT', 'PARENT', 'GUEST') NULL,
    `dateGenerated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateScanned` DATETIME(3) NULL,
    `entranceUserId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
