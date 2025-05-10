/*
  Warnings:

  - You are about to drop the column `rating_avg` on the `patch` table. All the data in the column will be lost.
  - You are about to drop the column `rating_count` on the `patch` table. All the data in the column will be lost.
  - You are about to drop the `patch_rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "patch_rating" DROP CONSTRAINT "patch_rating_patch_id_fkey";

-- DropForeignKey
ALTER TABLE "patch_rating" DROP CONSTRAINT "patch_rating_user_id_fkey";

-- AlterTable
ALTER TABLE "patch" DROP COLUMN "rating_avg",
DROP COLUMN "rating_count";

-- AlterTable
ALTER TABLE "patch_character" ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "original_id" INTEGER;

-- DropTable
DROP TABLE "patch_rating";

-- AddForeignKey
ALTER TABLE "patch_character" ADD CONSTRAINT "patch_character_original_id_fkey" FOREIGN KEY ("original_id") REFERENCES "patch_character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
