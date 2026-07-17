import { Migration } from "@mikro-orm/migrations";

export class Migration20260717090000 extends Migration {
    async up(): Promise<void> {
        // Drop any leftover in-progress markers (including duplicates left by the previous non-atomic
        // claim) so the unique index can be created. A dropped marker just means the next request
        // starts a fresh refresh.
        this.addSql('delete from "BlockIndexRefresh" where "finishedAt" is null;');
        this.addSql(
            'create unique index "BlockIndexRefresh_single_running" on "BlockIndexRefresh" (("finishedAt" IS NULL)) where "finishedAt" IS NULL;',
        );
    }

    async down(): Promise<void> {
        throw new Error("Unsupported");
    }
}
