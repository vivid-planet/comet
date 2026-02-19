import { Migration } from "@mikro-orm/migrations";

export class Migration20250317131301 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "BrevoEmailImportLog" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "importedEmail" text not null, "responsibleUserId" text not null, "importId" uuid null, "contactSource" text check ("contactSource" in (\'manualCreation\', \'csvImport\')) not null)',
        );
    }
}
