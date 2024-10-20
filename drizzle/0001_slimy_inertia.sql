ALTER TABLE "users" RENAME TO "boards";--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "columns" jsonb[] NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "boards" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN IF EXISTS "email";