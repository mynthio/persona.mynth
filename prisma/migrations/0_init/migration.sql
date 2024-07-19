-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaPrompt" (
    "id" TEXT NOT NULL DEFAULT ('pp_'::text || (xata_private.xid())::text),
    "name" TEXT NOT NULL DEFAULT 'New prompt',
    "input" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonaPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaGeneration" (
    "id" TEXT NOT NULL DEFAULT ('pg_'::text || (xata_private.xid())::text),
    "status" TEXT NOT NULL DEFAULT 'queued',
    "inngestEventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "promptId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" INTEGER NOT NULL,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonaGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL DEFAULT ('ps_'::text || (xata_private.xid())::text),
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "personalityTraits" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "culturalBackground" TEXT NOT NULL,
    "appearance" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "fullDescription" TEXT,
    "mainImageUrl" TEXT,
    "consistencyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isNsfw" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "personaGenerationId" TEXT,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaLike" (
    "personaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PersonaBookmark" (
    "personaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL DEFAULT ('cm_'::text || (xata_private.xid())::text),
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL DEFAULT ('i_'::text || (xata_private.xid())::text),
    "prompt" TEXT,
    "model" TEXT,
    "imageUrl" TEXT NOT NULL,
    "personaId" TEXT,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_user_xata_id_key" ON "User"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_persona_prompt_xata_id_key" ON "PersonaPrompt"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaGeneration_inngestEventId_key" ON "PersonaGeneration"("inngestEventId");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_persona_generation_xata_id_key" ON "PersonaGeneration"("xata_id");

-- CreateIndex
CREATE INDEX "PersonaGeneration_promptId_idx" ON "PersonaGeneration"("promptId");

-- CreateIndex
CREATE INDEX "PersonaGeneration_status_idx" ON "PersonaGeneration"("status");

-- CreateIndex
CREATE INDEX "PersonaGeneration_inngestEventId_idx" ON "PersonaGeneration"("inngestEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_personaGenerationId_key" ON "Persona"("personaGenerationId");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_persona_xata_id_key" ON "Persona"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_persona_like_xata_id_key" ON "PersonaLike"("xata_id");

-- CreateIndex
CREATE INDEX "PersonaLike_personaId_userId_idx" ON "PersonaLike"("personaId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaLike_personaId_userId_key" ON "PersonaLike"("personaId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_persona_bookmark_xata_id_key" ON "PersonaBookmark"("xata_id");

-- CreateIndex
CREATE INDEX "PersonaBookmark_personaId_userId_idx" ON "PersonaBookmark"("personaId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaBookmark_personaId_userId_key" ON "PersonaBookmark"("personaId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_comment_xata_id_key" ON "Comment"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_image_xata_id_key" ON "Image"("xata_id");

-- AddForeignKey
ALTER TABLE "PersonaPrompt" ADD CONSTRAINT "PersonaPrompt_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaGeneration" ADD CONSTRAINT "PersonaGeneration_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "PersonaPrompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_personaGenerationId_fkey" FOREIGN KEY ("personaGenerationId") REFERENCES "PersonaGeneration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaLike" ADD CONSTRAINT "PersonaLike_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaLike" ADD CONSTRAINT "PersonaLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaBookmark" ADD CONSTRAINT "PersonaBookmark_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaBookmark" ADD CONSTRAINT "PersonaBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

