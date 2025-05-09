-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(17) NOT NULL,
    "email" VARCHAR(1007) NOT NULL,
    "password" VARCHAR(1007) NOT NULL,
    "ip" VARCHAR(233) NOT NULL DEFAULT '',
    "avatar" VARCHAR(233) NOT NULL DEFAULT '',
    "role" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 0,
    "register_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moemoepoint" INTEGER NOT NULL DEFAULT 0,
    "bio" VARCHAR(107) NOT NULL DEFAULT '',
    "enable_email_notice" BOOLEAN NOT NULL DEFAULT true,
    "daily_image_count" INTEGER NOT NULL DEFAULT 0,
    "daily_check_in" INTEGER NOT NULL DEFAULT 0,
    "daily_upload_size" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_login_time" TEXT NOT NULL DEFAULT '',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_log" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "content" VARCHAR(10007) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follow_relation" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,

    CONSTRAINT "user_follow_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_message" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "content" VARCHAR(10007) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "link" VARCHAR(1007) NOT NULL DEFAULT '',
    "sender_id" INTEGER,
    "recipient_id" INTEGER,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_patch_favorite_folder" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL DEFAULT '',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_patch_favorite_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_patch_favorite_folder_relation" (
    "id" SERIAL NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_patch_favorite_folder_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_patch_comment_like_relation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_patch_comment_like_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_patch_resource_like_relation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_patch_resource_like_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch" (
    "id" SERIAL NOT NULL,
    "unique_id" VARCHAR(8) NOT NULL,
    "name" VARCHAR(1007) NOT NULL,
    "vndb_id" VARCHAR(107),
    "banner" VARCHAR(1007) NOT NULL DEFAULT '',
    "introduction" VARCHAR(100007) NOT NULL DEFAULT '',
    "released" VARCHAR(107) NOT NULL DEFAULT 'unknown',
    "content_limit" VARCHAR(107) NOT NULL DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 0,
    "download" INTEGER NOT NULL DEFAULT 0,
    "view" INTEGER NOT NULL DEFAULT 0,
    "resource_update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT[],
    "language" TEXT[],
    "engine" TEXT[],
    "platform" TEXT[],
    "user_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_alias" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(1007) NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(107) NOT NULL,
    "introduction" VARCHAR(10007) NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,
    "alias" TEXT[],
    "user_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_tag_relation" (
    "id" SERIAL NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_tag_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_resource" (
    "id" SERIAL NOT NULL,
    "storage" VARCHAR(107) NOT NULL,
    "section" VARCHAR(107) NOT NULL,
    "name" VARCHAR(300) NOT NULL DEFAULT '',
    "size" VARCHAR(107) NOT NULL DEFAULT '',
    "code" VARCHAR(1007) NOT NULL DEFAULT '',
    "password" VARCHAR(1007) NOT NULL DEFAULT '',
    "note" VARCHAR(10007) NOT NULL DEFAULT '',
    "hash" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "type" TEXT[],
    "language" TEXT[],
    "platform" TEXT[],
    "download" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_comment" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(10007) NOT NULL DEFAULT '',
    "edit" TEXT NOT NULL DEFAULT '',
    "parent_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patch_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(107) NOT NULL,
    "name_original" VARCHAR(107),
    "description" VARCHAR(10007) NOT NULL DEFAULT '',
    "image" VARCHAR(1007) NOT NULL DEFAULT '',
    "age" INTEGER,
    "gender" VARCHAR(20),
    "birthday" VARCHAR(50),
    "height" VARCHAR(20),
    "status" INTEGER NOT NULL DEFAULT 0,
    "patch_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patch_character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_follow_relation_follower_id_following_id_key" ON "user_follow_relation"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_patch_favorite_folder_user_id_name_key" ON "user_patch_favorite_folder"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_patch_favorite_folder_relation_folder_id_patch_id_key" ON "user_patch_favorite_folder_relation"("folder_id", "patch_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_patch_comment_like_relation_user_id_comment_id_key" ON "user_patch_comment_like_relation"("user_id", "comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_patch_resource_like_relation_user_id_resource_id_key" ON "user_patch_resource_like_relation"("user_id", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "patch_unique_id_key" ON "patch"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "patch_vndb_id_key" ON "patch"("vndb_id");

-- CreateIndex
CREATE INDEX "patch_alias_patch_id_idx" ON "patch_alias"("patch_id");

-- CreateIndex
CREATE INDEX "patch_alias_name_idx" ON "patch_alias"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patch_tag_name_key" ON "patch_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patch_tag_relation_patch_id_tag_id_key" ON "patch_tag_relation"("patch_id", "tag_id");

-- CreateIndex
CREATE INDEX "patch_character_patch_id_idx" ON "patch_character"("patch_id");

-- CreateIndex
CREATE INDEX "patch_character_name_idx" ON "patch_character"("name");

-- AddForeignKey
ALTER TABLE "admin_log" ADD CONSTRAINT "admin_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follow_relation" ADD CONSTRAINT "user_follow_relation_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follow_relation" ADD CONSTRAINT "user_follow_relation_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_message" ADD CONSTRAINT "user_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_message" ADD CONSTRAINT "user_message_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_patch_favorite_folder" ADD CONSTRAINT "user_patch_favorite_folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_patch_favorite_folder_relation" ADD CONSTRAINT "user_patch_favorite_folder_relation_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "user_patch_favorite_folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_patch_favorite_folder_relation" ADD CONSTRAINT "user_patch_favorite_folder_relation_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_patch_comment_like_relation" ADD CONSTRAINT "user_patch_comment_like_relation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_patch_comment_like_relation" ADD CONSTRAINT "user_patch_comment_like_relation_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "patch_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_patch_resource_like_relation" ADD CONSTRAINT "user_patch_resource_like_relation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_patch_resource_like_relation" ADD CONSTRAINT "user_patch_resource_like_relation_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "patch_resource"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch" ADD CONSTRAINT "patch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_alias" ADD CONSTRAINT "patch_alias_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_tag" ADD CONSTRAINT "patch_tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_tag_relation" ADD CONSTRAINT "patch_tag_relation_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_tag_relation" ADD CONSTRAINT "patch_tag_relation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "patch_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_resource" ADD CONSTRAINT "patch_resource_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_resource" ADD CONSTRAINT "patch_resource_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_comment" ADD CONSTRAINT "patch_comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "patch_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_comment" ADD CONSTRAINT "patch_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_comment" ADD CONSTRAINT "patch_comment_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patch_character" ADD CONSTRAINT "patch_character_patch_id_fkey" FOREIGN KEY ("patch_id") REFERENCES "patch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
