CREATE TABLE `PageTreeDocument` (
	`id` text PRIMARY KEY NOT NULL,
	`pageTreeNodeId` text NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`pageTreeNodeId`) REFERENCES `PageTreeNode`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PageTreeDocument_pageTreeNodeId_type_index` ON `PageTreeDocument` (`pageTreeNodeId`,`type`);