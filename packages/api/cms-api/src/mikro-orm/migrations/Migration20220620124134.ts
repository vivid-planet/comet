import { Migration } from "@mikro-orm/migrations";

export class Migration20220620124134 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Redirect" add column "target" json;');

        const rows = (await this.execute('select * from "Redirect"')) as Array<
            { id: string } & ({ targetType: "intern"; targetPageId: string } | { targetType: "extern"; targetUrl: string })
        >;

        for (const row of rows) {
            if (row.targetType === "intern") {
                this.addSql(
                    `update "Redirect" set "target" = '{ "data": { "attachedBlocks": [ { "type": "internal", "props": { ${
                        row.targetPageId ? `"targetPageId": "${row.targetPageId}"` : ""
                    } } } ], "activeType": "internal" }, "index": [ { "blockname": "Link", "jsonPath": "root", "visible": true }, { "blockname": "InternalLink", "jsonPath": "root.attachedBlocks.0.props", "visible": true } ] }' where "id" = '${
                        row.id
                    }';`,
                );
            } else {
                this.addSql(
                    `update "Redirect" set "target" = '{ "data": { "attachedBlocks": [ { "type": "external", "props": { ${
                        row.targetUrl ? `"targetUrl": "${row.targetUrl}", ` : ""
                    }"openInNewWindow": false } } ], "activeType": "external" }, "index": [ { "blockname": "Link", "jsonPath": "root", "visible": true }, { "blockname": "ExternalLink", "jsonPath": "root.attachedBlocks.0.props", "visible": true } ] }' where "id" = '${
                        row.id
                    }';`,
                );
            }
        }

        this.addSql('alter table "Redirect" alter column "target" set not null;');

        this.addSql('alter table "Redirect" drop constraint "Redirect_targetType_check";');
        this.addSql('alter table "Redirect" drop column "targetType";');
        this.addSql('alter table "Redirect" drop column "targetUrl";');
        this.addSql('alter table "Redirect" drop column "targetPageId";');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "Redirect" add column "targetType" text not null default null, add column "targetUrl" text null default null, add column "targetPageId" uuid null default null;',
        );
        this.addSql('alter table "Redirect" drop column "target";');
        this.addSql(
            'alter table "Redirect" add constraint "Redirect_targetType_check" check("targetType" = ANY (ARRAY[\'intern\'::text, \'extern\'::text]));',
        );
    }
}
