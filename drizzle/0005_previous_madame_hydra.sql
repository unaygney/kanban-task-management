DROP INDEX IF EXISTS "slug_unique_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_slug_unique_idx" ON "boards" USING btree ("userId","slug");