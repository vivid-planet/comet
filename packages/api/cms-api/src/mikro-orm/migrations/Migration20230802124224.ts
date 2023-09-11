import { Migration } from "@mikro-orm/migrations";

export class Migration20230802124224 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "BlockIndexRefresh" ("id" uuid not null, "startedAt" timestamp with time zone not null, "finishedAt" timestamp with time zone);',
        );
        this.addSql('alter table "BlockIndexRefresh" add constraint "BlockIndexRefresh_pkey" primary key ("id");');
    }

    async down(): Promise<void> {
        this.addSql('drop table "BlockIndexRefresh";');
    }
}
