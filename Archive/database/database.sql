-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "blogCategories", "blogs", "course", "courseCategories", "courseComments", "courseRating", "courseReview", "currencies", "enrollments", "jobApplications", "jobs", "languages", "lessons", "location","messages","newsletterSubscription","payments","platformSetting","preference","profile", "section","skillTest","subscriptions","todos","userLogs","users","userSession", "permissions", "permissionCategories", "article", "articleComments", "learningMaterials", "skillTestResult", "forum", "forumGists" CASCADE;

CREATE TABLE "permissions" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "sid" uuid,
  "permissions" varchar NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "permissionCategories" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "permission" varchar NOT NULL,
  "permission_description" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "userLogs" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "sid" uuid,
  "last_login_date" timestamp,
  "machine" varchar,
  "browser" varchar,
  "location" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "users" (
  "id" uuid UNIQUE DEFAULT uuid_generate_v4 (),
  "login_id" text UNIQUE PRIMARY KEY,
  "password" varchar NOT NULL,
  "status" varchar DEFAULT ('pending'),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "profile" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "sid" uuid UNIQUE NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "other_names" varchar,
  "social_links" varchar,
  "bio" varchar,
  "profile_picture" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "section" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "course_id" uuid,
  "author" uuid NOT NULL,
  "title" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "userSession" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "sid" uuid,
  "ip_address" varchar NOT NULL,
  "data" varchar,
  "timestamp" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);



CREATE TABLE "currencies" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4 (),
  "code" varchar NOT NULL,
  "symbol" varchar,
  "name" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);


ALTER TABLE "permissions" ADD FOREIGN KEY ("sid") REFERENCES "users" ("id");

ALTER TABLE "userLogs" ADD FOREIGN KEY ("sid") REFERENCES "users" ("id");

ALTER TABLE "section" ADD FOREIGN KEY ("course_id") REFERENCES "course" ("id");

ALTER TABLE "userSession" ADD FOREIGN KEY ("sid") REFERENCES "users" ("id");
