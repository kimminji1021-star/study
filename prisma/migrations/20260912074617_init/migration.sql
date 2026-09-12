-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'NO_ANSWER', 'DONE', 'CONVERTED', 'HOLD', 'CLOSED');

-- CreateEnum
CREATE TYPE "PreferredTime" AS ENUM ('ANY', 'MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('PC', 'MOBILE');

-- CreateTable
CREATE TABLE "consultation_requests" (
    "id" UUID NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "preferred_time" "PreferredTime" NOT NULL DEFAULT 'ANY',
    "message" TEXT,
    "agree_privacy" BOOLEAN NOT NULL DEFAULT true,
    "agree_marketing" BOOLEAN NOT NULL DEFAULT false,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'NEW',
    "admin_memo" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "referrer" TEXT,
    "device_type" "DeviceType",
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_history" (
    "id" UUID NOT NULL,
    "consultation_id" UUID NOT NULL,
    "prev_status" "ConsultationStatus",
    "next_status" "ConsultationStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultation_requests_seq_key" ON "consultation_requests"("seq");

-- CreateIndex
CREATE INDEX "consultation_requests_status_created_at_idx" ON "consultation_requests"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "consultation_requests_created_at_idx" ON "consultation_requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "consultation_requests_phone_created_at_idx" ON "consultation_requests"("phone", "created_at" DESC);

-- CreateIndex
CREATE INDEX "consultation_history_consultation_id_changed_at_idx" ON "consultation_history"("consultation_id", "changed_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "consultation_history" ADD CONSTRAINT "consultation_history_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultation_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Supabase의 PostgREST는 public 스키마를 anon/authenticated 에 노출한다.
-- 이 테이블들은 Prisma 직결로만 다루므로 RLS를 켜고 정책은 두지 않는다(= 전면 차단).
ALTER TABLE "consultation_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consultation_requests" FORCE ROW LEVEL SECURITY;
ALTER TABLE "consultation_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consultation_history" FORCE ROW LEVEL SECURITY;
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_users" FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "consultation_requests" FROM anon, authenticated;
REVOKE ALL ON TABLE "consultation_history" FROM anon, authenticated;
REVOKE ALL ON TABLE "admin_users" FROM anon, authenticated;
