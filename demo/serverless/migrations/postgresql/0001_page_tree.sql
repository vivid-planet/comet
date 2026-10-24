CREATE TABLE "PageTreeNode" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parentId" uuid,
	"pos" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"visibility" text DEFAULT 'Unpublished' NOT NULL,
	"documentType" text NOT NULL,
	"category" text NOT NULL,
	"hideInMenu" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"scope_domain" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "PageTreeNode" ADD CONSTRAINT "PageTreeNode_parentId_PageTreeNode_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."PageTreeNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "PageTreeNode_parentId_index" ON "PageTreeNode" USING btree ("parentId");