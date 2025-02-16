CREATE TYPE "public"."loan_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_name" varchar(255) NOT NULL,
	"requested_amount" numeric,
	"status" "loan_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
