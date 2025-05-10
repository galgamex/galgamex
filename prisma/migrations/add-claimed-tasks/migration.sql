-- 在user表中添加claimed_tasks字段
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "claimed_tasks" TEXT[] DEFAULT ARRAY[]::TEXT[]; 