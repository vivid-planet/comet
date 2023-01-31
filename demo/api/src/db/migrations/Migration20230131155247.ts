import { Migration } from "@mikro-orm/migrations";

export class Migration20230131155247 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop index "unique_name_in_root_folder_index"');
        this.addSql('drop index "unique_name_in_folder_index"');

        this.addSql('create unique index "unique_name_in_root_folder_index" on "DamFile" ("name", "scope_domain") where "folderId" IS NULL');
        this.addSql(
            'create unique index "unique_name_in_folder_index" on "DamFile" ("folderId", "name", "scope_domain") where "folderId" IS NOT NULL',
        );
    }
}
