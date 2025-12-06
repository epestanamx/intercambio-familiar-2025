-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "assignedToId" TEXT,
    "hasRevealed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_slug_key" ON "Participant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_assignedToId_key" ON "Participant"("assignedToId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
