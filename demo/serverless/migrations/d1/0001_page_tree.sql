CREATE TABLE `PageTreeNode` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
	`pos` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`visibility` text DEFAULT 'Unpublished' NOT NULL,
	`documentType` text NOT NULL,
	`category` text NOT NULL,
	`hideInMenu` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`scope_domain` text NOT NULL,
	FOREIGN KEY (`parentId`) REFERENCES `PageTreeNode`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `PageTreeNode_parentId_index` ON `PageTreeNode` (`parentId`);