ALTER TABLE "boards" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_unique_idx" ON "boards" USING btree ("slug");