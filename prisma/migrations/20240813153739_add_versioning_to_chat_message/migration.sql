-- CreateTable
CREATE TABLE "ChatMessageVersion" (
    "id" TEXT NOT NULL DEFAULT ('cmv_'::text || (xata_private.xid())::text),
    "content" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT true,
    "chatMessageId" TEXT NOT NULL,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_chat_message_version_xata_id_key" ON "ChatMessageVersion"("xata_id");

-- AddForeignKey
ALTER TABLE "ChatMessageVersion" ADD CONSTRAINT "ChatMessageVersion_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
