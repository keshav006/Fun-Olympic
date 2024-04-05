-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_livechat_id_fkey";

-- AlterTable
ALTER TABLE "message" ALTER COLUMN "comment_id" DROP NOT NULL,
ALTER COLUMN "livechat_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_livechat_id_fkey" FOREIGN KEY ("livechat_id") REFERENCES "livechat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
