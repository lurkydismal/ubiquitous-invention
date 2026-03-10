CREATE TYPE "post_visibility" AS ENUM('public', 'unlisted', 'private');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL UNIQUE,
	"updated_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "name_not_blank" CHECK (length(trim("name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" integer,
	"following_id" integer,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follows_pkey" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "follower_cannot_follow_themselves" CHECK (follower_id != following_id)
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY,
	"author_id" integer,
	"co_author_id" integer,
	"category_id" integer,
	"title" varchar(50) NOT NULL,
	"description" varchar(100),
	"content" text NOT NULL,
	"content_warning" boolean DEFAULT false NOT NULL,
	"visibility" "post_visibility" DEFAULT 'public'::"post_visibility" NOT NULL,
	"scheduled_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"reading_time" smallint NOT NULL,
	"updated_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "title_longer_than_10" CHECK (length(trim("title")) > 10),
	CONSTRAINT "description_longer_than_10" CHECK ("description" IS NULL OR length(trim("description")) > 10),
	CONSTRAINT "content_longer_than_100" CHECK (length(trim("content")) > 100),
	CONSTRAINT "scheduled_at_not_in_past" CHECK ("scheduled_at" >= NOW()),
	CONSTRAINT "reading_time_not_blank" CHECK ("reading_time" > 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" varchar(32) NOT NULL UNIQUE,
	"username_normalized" varchar(32) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"avatar_url" varchar(255),
	"updated_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "username_not_blank" CHECK (length(trim("username")) > 0),
	CONSTRAINT "username_normalized_not_blank" CHECK (length(trim("username_normalized")) > 0),
	CONSTRAINT "username_normalized_lowercase" CHECK ("username_normalized" = lower("username_normalized")),
	CONSTRAINT "avatar_url_not_blank" CHECK ("avatar_url" IS NULL OR length(trim("avatar_url")) > 0)
);
--> statement-breakpoint
CREATE INDEX "follows_follower_id_index" ON "follows" ("follower_id");--> statement-breakpoint
CREATE INDEX "follows_following_id_index" ON "follows" ("following_id");--> statement-breakpoint
CREATE INDEX "posts_author_id_index" ON "posts" ("author_id");--> statement-breakpoint
CREATE INDEX "posts_co_author_id_index" ON "posts" ("co_author_id");--> statement-breakpoint
CREATE INDEX "posts_category_id_index" ON "posts" ("category_id");--> statement-breakpoint
CREATE INDEX "posts_author_id_created_at_index" ON "posts" ("author_id","created_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_co_author_id_users_id_fkey" FOREIGN KEY ("co_author_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL;

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Register triggers
CREATE TRIGGER update_table_updated_at
BEFORE UPDATE ON "categories"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_table_updated_at
BEFORE UPDATE ON "posts"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_table_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
