-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `pointsTotal` INTEGER NOT NULL DEFAULT 0,
    `pointsSpent` INTEGER NOT NULL DEFAULT 0,
    `strength` INTEGER NOT NULL DEFAULT 0,
    `magic` INTEGER NOT NULL DEFAULT 0,
    `vitality` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `resistance` INTEGER NOT NULL DEFAULT 0,
    `stamina` INTEGER NOT NULL DEFAULT 0,
    `agility` INTEGER NOT NULL DEFAULT 0,
    `focus` INTEGER NOT NULL DEFAULT 0,
    `luck` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `manaCost` INTEGER NOT NULL DEFAULT 0,
    `staminaCost` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Card_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterCard` (
    `id` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `acquiredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CharacterCard_characterId_cardId_key`(`characterId`, `cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeckCard` (
    `id` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `slotIndex` INTEGER NOT NULL,

    UNIQUE INDEX `DeckCard_characterId_slotIndex_key`(`characterId`, `slotIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `slot` ENUM('HEAD', 'CHEST', 'LEGS', 'FEET', 'HANDS', 'WEAPON', 'OFFHAND', 'RING', 'AMULET') NOT NULL,
    `strength` INTEGER NOT NULL DEFAULT 0,
    `magic` INTEGER NOT NULL DEFAULT 0,
    `vitality` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `resistance` INTEGER NOT NULL DEFAULT 0,
    `stamina` INTEGER NOT NULL DEFAULT 0,
    `agility` INTEGER NOT NULL DEFAULT 0,
    `focus` INTEGER NOT NULL DEFAULT 0,
    `luck` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Equipment_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `id` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `equipped` BOOLEAN NOT NULL DEFAULT false,
    `acquiredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterCard` ADD CONSTRAINT `CharacterCard_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterCard` ADD CONSTRAINT `CharacterCard_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeckCard` ADD CONSTRAINT `DeckCard_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeckCard` ADD CONSTRAINT `DeckCard_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
