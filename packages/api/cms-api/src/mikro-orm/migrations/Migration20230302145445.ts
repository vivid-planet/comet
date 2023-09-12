import { Migration } from "@mikro-orm/migrations";

export class Migration20230302145445 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table if exists "PageTreeNode" add column if not exists "updatedAt" timestamp with time zone;');
        this.addSql(
            `do $$
            begin
                if exists (select 1 from pg_class where relname='PageTreeNode')
                then update "PageTreeNode" SET "updatedAt"=CURRENT_DATE;
                end if;
            end
            $$;`,
        );
        this.addSql('alter table if exists "PageTreeNode" alter column "updatedAt" set not null');
    }

    async down(): Promise<void> {
        this.addSql('alter table if exists "PageTreeNode" drop column "updatedAt";');
    }
}
