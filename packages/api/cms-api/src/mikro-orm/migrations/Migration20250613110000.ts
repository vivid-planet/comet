import { Migration } from "@mikro-orm/migrations";

export class Migration20250613110000 extends Migration {
    async up(): Promise<void> {
        this.addSql('create table "DamFileSubtitle" ("id" uuid not null, "video_id" uuid not null, "file_id" uuid not null, "language" text not null);');
        this.addSql('alter table "DamFileSubtitle" add constraint "DamFileSubtitle_pkey" primary key ("id");');
        this.addSql('alter table "DamFileSubtitle" add constraint "DamFileSubtitle_video_id_foreign" foreign key ("video_id") references "DamFile" ("id") on update cascade on delete cascade;');
        this.addSql('alter table "DamFileSubtitle" add constraint "DamFileSubtitle_file_id_foreign" foreign key ("file_id") references "DamFile" ("id") on update cascade on delete cascade;');
    }
}
