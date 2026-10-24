CREATE TABLE `DamFileImage` (
	`id` text PRIMARY KEY NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`exif` text,
	`dominantColor` text,
	`cropAreaFocalPoint` text NOT NULL,
	`cropAreaWidth` real,
	`cropAreaHeight` real,
	`cropAreaX` real,
	`cropAreaY` real
);
--> statement-breakpoint
CREATE TABLE `DamFile` (
	`id` text PRIMARY KEY NOT NULL,
	`folderId` text,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`mimetype` text NOT NULL,
	`contentHash` text NOT NULL,
	`title` text,
	`altText` text,
	`archived` integer DEFAULT false NOT NULL,
	`imageId` text,
	`licenseType` text,
	`licenseDetails` text,
	`licenseAuthor` text,
	`licenseDurationFrom` integer,
	`licenseDurationTo` integer,
	`importSourceId` text,
	`importSourceType` text,
	`copyOfId` text,
	`aiContentType` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`scope_domain` text NOT NULL,
	FOREIGN KEY (`folderId`) REFERENCES `DamFolder`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`imageId`) REFERENCES `DamFileImage`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`copyOfId`) REFERENCES `DamFile`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `DamFile_imageId_unique` ON `DamFile` (`imageId`);--> statement-breakpoint
CREATE INDEX `DamFile_contentHash_index` ON `DamFile` (`contentHash`);--> statement-breakpoint
CREATE INDEX `DamFile_folderId_index` ON `DamFile` (`folderId`);--> statement-breakpoint
CREATE TABLE `DamFolder` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parentId` text,
	`archived` integer DEFAULT false NOT NULL,
	`isInboxFromOtherScope` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`scope_domain` text NOT NULL,
	FOREIGN KEY (`parentId`) REFERENCES `DamFolder`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `DamFolder_parentId_index` ON `DamFolder` (`parentId`);--> statement-breakpoint
CREATE TABLE `GroupRole` (
	`id` text PRIMARY KEY NOT NULL,
	`group` text NOT NULL,
	`roleId` text NOT NULL,
	`contentScopes` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `GroupRole_group_index` ON `GroupRole` (`group`);--> statement-breakpoint
CREATE TABLE `Role` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`permissions` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `UserPermission` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`permission` text NOT NULL,
	`contentScopes` text NOT NULL,
	`validFrom` integer,
	`validTo` integer,
	`reason` text,
	`requestedBy` text,
	`approvedBy` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `UserPermission_userId_index` ON `UserPermission` (`userId`);--> statement-breakpoint
CREATE TABLE `UserRole` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`roleId` text NOT NULL,
	`contentScopes` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `UserRole_userId_index` ON `UserRole` (`userId`);