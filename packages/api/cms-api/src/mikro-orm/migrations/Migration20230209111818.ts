import { Migration } from "@mikro-orm/migrations";

export class Migration20230209111818 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop index if exists "unique_name_in_root_folder_index";');
        this.addSql('drop index if exists "unique_name_in_folder_index";');
    }
}
