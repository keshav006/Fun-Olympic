/*
  Warnings:

  - You are about to drop the `liveChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "liveChat" DROP CONSTRAINT "liveChat_event_id_fkey";

-- DropForeignKey
ALTER TABLE "liveChat" DROP CONSTRAINT "liveChat_message_id_fkey";

-- DropForeignKey
ALTER TABLE "liveChat" DROP CONSTRAINT "liveChat_user_id_fkey";

-- DropTable
DROP TABLE "liveChat";

-- CreateTable
CREATE TABLE "livechat" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "livechat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "livechat_message_id_key" ON "livechat"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "livechat_event_id_key" ON "livechat"("event_id");

-- AddForeignKey
ALTER TABLE "livechat" ADD CONSTRAINT "livechat_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livechat" ADD CONSTRAINT "livechat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livechat" ADD CONSTRAINT "livechat_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
