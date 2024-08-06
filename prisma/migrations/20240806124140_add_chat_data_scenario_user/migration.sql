-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "nsfw" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scenario" TEXT,
ADD COLUMN     "userCharacter" JSONB;
