import { Migration } from "@mikro-orm/migrations";

export class Migration20220127111301 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "DamFileImage" ("id" uuid not null, "width" integer not null, "height" integer not null, "exif" json null, "dominantColor" text null, "cropArea_focalPoint" text check ("cropArea_focalPoint" in (\'SMART\', \'CENTER\', \'NORTHWEST\', \'NORTHEAST\', \'SOUTHWEST\', \'SOUTHEAST\')) not null, "cropArea_width" double precision null, "cropArea_height" double precision null, "cropArea_x" double precision null, "cropArea_y" double precision null);',
        );
        this.addSql('alter table "DamFileImage" add constraint "DamFileImage_pkey" primary key ("id");');

        this.addSql(
            'create table "DamFolder" ("id" uuid not null, "name" text not null, "parentId" uuid null, "mpath" uuid array not null, "archived" boolean not null default false, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "DamFolder" add constraint "DamFolder_pkey" primary key ("id");');
        this.addSql('create index "DamFolder_mpath_index" on "DamFolder" ("mpath");');

        this.addSql(
            'create table "DamFile" ("id" uuid not null, "folderId" uuid null, "name" text not null, "size" bigint not null, "mimetype" text not null, "contentHash" character(32) not null, "title" text null, "altText" text null, "archived" boolean not null default false, "imageId" uuid null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null);',
        );
        this.addSql('alter table "DamFile" add constraint "DamFile_pkey" primary key ("id");');
        this.addSql('create index "DamFile_contentHash_index" on "DamFile" ("contentHash");');
        this.addSql('alter table "DamFile" add constraint "DamFile_imageId_unique" unique ("imageId");');

        this.addSql(
            'alter table "DamFolder" add constraint "DamFolder_parentId_foreign" foreign key ("parentId") references "DamFolder" ("id") on update cascade on delete CASCADE;',
        );

        this.addSql(
            'alter table "DamFile" add constraint "DamFile_folderId_foreign" foreign key ("folderId") references "DamFolder" ("id") on update cascade on delete set null;',
        );
        this.addSql(
            'alter table "DamFile" add constraint "DamFile_imageId_foreign" foreign key ("imageId") references "DamFileImage" ("id") on update cascade on delete cascade;',
        );

        this.addSql('create unique index "unique_name_in_root_folder_index" on "DamFile" ("name") where "folderId" IS NULL');
        this.addSql('create unique index "unique_name_in_folder_index" on "DamFile" ("folderId", "name") where "folderId" IS NOT NULL');
    }
}
