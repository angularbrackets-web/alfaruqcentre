-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- Seed default donate URL
INSERT INTO "settings" ("key", "value", "updatedAt") VALUES ('donateUrl', 'https://donorchoice.ca/dia', NOW()) ON CONFLICT DO NOTHING;
