/*
  Warnings:

  - You are about to drop the column `cv` on the `patch_character` table. All the data in the column will be lost.
  - You are about to drop the column `is_main` on the `patch_character` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `patch_character` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `description` on the `patch_character` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10007)`.
  - Added the required column `user_id` to the `patch_character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patch_character" DROP CONSTRAINT "patch_character_patch_id_fkey";

-- DropIndex
DROP INDEX "patch_character_patch_id_idx";

-- AlterTable
ALTER TABLE "patch_character" DROP COLUMN "cv",
DROP COLUMN "is_main",
ADD COLUMN     "age" VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN     "alias" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "birthday" VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN     "blood_type" VARCHAR(10) NOT NULL DEFAULT '',
ADD COLUMN     "favorite" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "height" VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN     "hobby" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "personality" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relationship" VARCHAR(1000) NOT NULL DEFAULT '',
ADD COLUMN     "role_type" VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN     "three_sizes" VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN     "traits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "voice_actor" VARCHAR(100) NOT NULL DEFAULT '',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "description" SET DATA TYPE VARCHAR(10007),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(1007);

-- AddForeignKey
ALTER TABLE "patch_character" ADD CONSTRAINT "patch_character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_character" ADD CONSTRAINT "patch_character_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
