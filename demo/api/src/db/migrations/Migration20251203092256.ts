import { Migration } from "@mikro-orm/migrations";

export class Migration20251203092256 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "Product" drop constraint if exists "Product_type_check";`);
        this.addSql(
            `alter table "Product" add constraint "Product_type_check" check("type" in ('cap', 'shirt', 'tie', 'pants', 'jacket', 'shoes', 'socks', 'mug', 'pen', 'calendar', 'notebook', 'bag', 'watch', 'sunglasses', 'wallet'));`,
        );
        this.addSql('alter table "Product" alter column "type" type text using ("type"::text);');
        this.addSql('alter table "Product" alter column "soldCount" type int using ("soldCount"::int);');
    }
}
