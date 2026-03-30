-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL,
ALTER COLUMN "due_date" SET DEFAULT NOW() + INTERVAL '7 days';
