import { Migration } from "@mikro-orm/migrations";

export class Migration20240814090541 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop index "PublicUpload_contentHash_index";');
        this.addSql('create index "CometFileUpload_contentHash_index" on "CometFileUpload" ("contentHash");');
    }
}
