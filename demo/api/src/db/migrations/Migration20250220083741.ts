import { Migration } from "@mikro-orm/migrations";

export class Migration20250220083741 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "Product" drop constraint if exists "Product_type_check";');
        this.addSql('alter table "Product" alter column "type" type text using ("type"::text);');
        this.addSql(
            "alter table \"Product\" add constraint \"Product_type_check\" check (\"type\" in ('Cap', 'Shirt', 'Tie', 'Pants', 'Jacket', 'Shoes', 'Socks', 'Mug', 'Pen', 'Calendar', 'Notebook', 'Bag', 'Watch', 'Sunglasses', 'Wallet'));",
        );
        this.addSql('alter table "Product" alter column "soldCount" type int using ("soldCount"::int);');
    }
}
