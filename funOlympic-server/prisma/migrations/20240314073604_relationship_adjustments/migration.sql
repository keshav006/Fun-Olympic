/*
  Warnings:

  - You are about to drop the column `message_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `livechat` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `livechat` table. All the data in the column will be lost.
  - Added the required column `comment_id` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livechat_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_message_id_fkey";

-- DropForeignKey
ALTER TABLE "livechat" DROP CONSTRAINT "livechat_message_id_fkey";

-- DropIndex
DROP INDEX "comments_message_id_key";

-- DropIndex
DROP INDEX "livechat_message_id_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "message_id";

-- AlterTable
ALTER TABLE "livechat" DROP COLUMN "message_id",
DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "comment_id" INTEGER NOT NULL,
ADD COLUMN     "livechat_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_livechat_id_fkey" FOREIGN KEY ("livechat_id") REFERENCES "livechat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
