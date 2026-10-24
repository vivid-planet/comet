CREATE TABLE "DamFileImage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"exif" jsonb,
	"dominantColor" text,
	"cropAreaFocalPoint" text NOT NULL,
	"cropAreaWidth" double precision,
	"cropAreaHeight" double precision,
	"cropAreaX" double precision,
	"cropAreaY" double precision
);
--> statement-breakpoint
CREATE TABLE "DamFile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"folderId" uuid,
	"name" text NOT NULL,
	"size" bigint NOT NULL,
	"mimetype" text NOT NULL,
	"contentHash" text NOT NULL,
	"title" text,
	"altText" text,
	"archived" boolean DEFAULT false NOT NULL,
	"imageId" uuid,
	"licenseType" text,
	"licenseDetails" text,
	"licenseAuthor" text,
	"licenseDurationFrom" timestamp with time zone,
	"licenseDurationTo" timestamp with time zone,
	"importSourceId" text,
	"importSourceType" text,
	"copyOfId" uuid,
	"aiContentType" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"scope_domain" text NOT NULL,
	CONSTRAINT "DamFile_imageId_unique" UNIQUE("imageId")
);
--> statement-breakpoint
CREATE TABLE "DamFolder" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parentId" uuid,
	"archived" boolean DEFAULT false NOT NULL,
	"isInboxFromOtherScope" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"scope_domain" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GroupRole" (
	"id" uuid PRIMARY KEY NOT NULL,
	"group" text NOT NULL,
	"roleId" text NOT NULL,
	"contentScopes" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"permissions" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserPermission" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"permission" text NOT NULL,
	"contentScopes" jsonb NOT NULL,
	"validFrom" timestamp with time zone,
	"validTo" timestamp with time zone,
	"reason" text,
	"requestedBy" text,
	"approvedBy" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserRole" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"roleId" text NOT NULL,
	"contentScopes" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "DamFile" ADD CONSTRAINT "DamFile_folderId_DamFolder_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."DamFolder"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DamFile" ADD CONSTRAINT "DamFile_imageId_DamFileImage_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."DamFileImage"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DamFile" ADD CONSTRAINT "DamFile_copyOfId_DamFile_id_fk" FOREIGN KEY ("copyOfId") REFERENCES "public"."DamFile"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DamFolder" ADD CONSTRAINT "DamFolder_parentId_DamFolder_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."DamFolder"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupRole" ADD CONSTRAINT "GroupRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "DamFile_contentHash_index" ON "DamFile" USING btree ("contentHash");--> statement-breakpoint
CREATE INDEX "DamFile_folderId_index" ON "DamFile" USING btree ("folderId");--> statement-breakpoint
CREATE INDEX "DamFolder_parentId_index" ON "DamFolder" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "GroupRole_group_index" ON "GroupRole" USING btree ("group");--> statement-breakpoint
CREATE INDEX "UserPermission_userId_index" ON "UserPermission" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "UserRole_userId_index" ON "UserRole" USING btree ("userId");