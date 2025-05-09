-- AlterTable
ALTER TABLE "patch" ADD COLUMN     "rating_avg" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "patch_rating" (
    "id" SERIAL NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "review" VARCHAR(1000),
    "user_id" INTEGER NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patch_rating_user_id_patch_id_key" ON "patch_rating"("user_id", "patch_id");

-- AddForeignKey
ALTER TABLE "patch_rating" ADD CONSTRAINT "patch_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_rating" ADD CONSTRAINT "patch_rating_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
