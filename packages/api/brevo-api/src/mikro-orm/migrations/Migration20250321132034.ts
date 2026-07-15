import { Migration } from "@mikro-orm/migrations";

export class Migration20250321132034 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "BlacklistedContacts" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "hashedEmail" text not null)',
        );
    }
}
