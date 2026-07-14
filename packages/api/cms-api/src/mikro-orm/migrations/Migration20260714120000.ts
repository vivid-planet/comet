import { Migration } from "@mikro-orm/migrations";

export class Migration20260714120000 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "DamFile" add column "aiGeneration" text check ("aiGeneration" in ('AiGenerated', 'AiModified')) null;`);
    }
}
