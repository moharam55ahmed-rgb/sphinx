/*
  Warnings:

  - You are about to alter the column `label` on the `navigationitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `title` on the `page` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `title` on the `pagesection` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `subtitle` on the `pagesection` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `description` on the `pagesection` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `buttonText` on the `pagesection` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `title` on the `project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `shortDescription` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `description` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `name` on the `projectcategory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `description` on the `projectcategory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `media` ADD COLUMN `galleryCategoryId` VARCHAR(191) NULL,
    ADD COLUMN `showInGallery` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `navigationitem` MODIFY `label` JSON NOT NULL;

-- AlterTable
ALTER TABLE `page` MODIFY `title` JSON NOT NULL;

-- AlterTable
ALTER TABLE `pagesection` MODIFY `title` JSON NULL,
    MODIFY `subtitle` JSON NULL,
    MODIFY `description` JSON NULL,
    MODIFY `buttonText` JSON NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `title` JSON NOT NULL,
    MODIFY `shortDescription` JSON NULL,
    MODIFY `description` JSON NULL;

-- AlterTable
ALTER TABLE `projectcategory` MODIFY `name` JSON NOT NULL,
    MODIFY `description` JSON NULL;

-- CreateTable
CREATE TABLE `NewsCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` JSON NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` JSON NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GalleryCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_visits` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `referrer` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `page_visits_createdAt_idx`(`createdAt`),
    INDEX `page_visits_path_idx`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` VARCHAR(191) NOT NULL,
    `title` JSON NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `excerpt` JSON NULL,
    `mainImage` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'projects',
    `status` VARCHAR(191) NOT NULL DEFAULT 'published',
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_galleryCategoryId_fkey` FOREIGN KEY (`galleryCategoryId`) REFERENCES `GalleryCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
