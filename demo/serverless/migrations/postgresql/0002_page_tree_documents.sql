CREATE TABLE "PageTreeDocument" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pageTreeNodeId" uuid NOT NULL,
	"type" text NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "PageTreeDocument" ADD CONSTRAINT "PageTreeDocument_pageTreeNodeId_PageTreeNode_id_fk" FOREIGN KEY ("pageTreeNodeId") REFERENCES "public"."PageTreeNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "PageTreeDocument_pageTreeNodeId_type_index" ON "PageTreeDocument" USING btree ("pageTreeNodeId","type");