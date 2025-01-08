import { Migration } from "@mikro-orm/migrations";

export class Migration20241127102900 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "FormBuilder" ("id" uuid not null, "createdAt" timestamp with time zone not null, "updatedAt" timestamp with time zone not null, "name" text not null, "blocks" json not null, "submitButtonText" text null, constraint "FormBuilder_pkey" primary key ("id"));',
        );
        this.addSql(
            'create table "FormRequest" ("id" uuid not null, "createdAt" timestamp with time zone not null, "form" uuid not null, "submitData" jsonb not null, constraint "FormRequest_pkey" primary key ("id"));',
        );
        this.addSql(
            'alter table "FormRequest" add constraint "FormRequest_form_foreign" foreign key ("form") references "FormBuilder" ("id") on update cascade;',
        );
        this.addSql('alter table "FormBuilder" add column "scope_domain" text not null, add column "scope_language" text not null;');
    }
}
