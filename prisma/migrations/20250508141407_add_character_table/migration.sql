/*
  Warnings:

  - You are about to drop the column `age` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `name_original` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `patch_character` table. All the data in the column will be lost.
  - You are about to alter the column `image` on the `patch_character` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1007)` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "patch_character" DROP CONSTRAINT "patch_character_patch_id_fkey";

-- DropIndex
DROP INDEX "patch_character_name_idx";

-- AlterTable
ALTER TABLE "patch_character" DROP COLUMN "age",
DROP COLUMN "birthday",
DROP COLUMN "gender",
DROP COLUMN "height",
DROP COLUMN "name_original",
DROP COLUMN "status",
ADD COLUMN     "cv" VARCHAR(255),
ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "image" DROP DEFAULT,
ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "patch_character" ADD CONSTRAINT "patch_character_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
