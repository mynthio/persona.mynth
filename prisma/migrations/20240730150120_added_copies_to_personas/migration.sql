-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_personaId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_personaId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_personaId_fkey";

-- DropForeignKey
ALTER TABLE "Persona" DROP CONSTRAINT "Persona_personaGenerationId_fkey";

-- DropForeignKey
ALTER TABLE "PersonaBookmark" DROP CONSTRAINT "PersonaBookmark_personaId_fkey";

-- DropForeignKey
ALTER TABLE "PersonaGeneration" DROP CONSTRAINT "PersonaGeneration_promptId_fkey";

-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "copiesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "original" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalPersonaId" TEXT;

-- AddForeignKey
ALTER TABLE "PersonaGeneration" ADD CONSTRAINT "PersonaGeneration_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "PersonaPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_personaGenerationId_fkey" FOREIGN KEY ("personaGenerationId") REFERENCES "PersonaGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_originalPersonaId_fkey" FOREIGN KEY ("originalPersonaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaBookmark" ADD CONSTRAINT "PersonaBookmark_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
