import { Migration } from "@mikro-orm/migrations";

export class Migration20250707093716 extends Migration {
    async up(): Promise<void> {
        this.addSql(`alter table "News" drop constraint if exists "News_status_check";`);
        this.addSql(`alter table "News" drop constraint if exists "News_category_check";`);
        this.addSql(`update "News" set status = 'active' where status = 'Active';`);
        this.addSql(`update "News" set status = 'deleted' where status = 'Deleted';`);
        this.addSql(`update "News" set category = 'events' where category = 'Events';`);
        this.addSql(`update "News" set category = 'company' where category = 'Company';`);
        this.addSql(`update "News" set category = 'awards' where category = 'Awards';`);
        this.addSql(`alter table "News" add constraint "News_status_check" check (status in ('active', 'deleted'));`);
        this.addSql(`alter table "News" add constraint "News_category_check" check (category in ('events', 'company', 'awards'));`);

        this.addSql(`alter table "PageTreeNode" drop constraint if exists "PageTreeNode_category_check";`);
        this.addSql(`alter table "PageTreeNode" drop constraint if exists "PageTreeNode_userGroup_check";`);
        this.addSql(`update "PageTreeNode" set category = 'mainNavigation' where category = 'MainNavigation';`);
        this.addSql(`update "PageTreeNode" set category = 'topMenu' where category = 'TopMenu';`);
        this.addSql(`update "PageTreeNode" set "userGroup" = 'all' where "userGroup" = 'All';`);
        this.addSql(`update "PageTreeNode" set "userGroup" = 'admin' where "userGroup" = 'Admin';`);
        this.addSql(`update "PageTreeNode" set "userGroup" = 'user' where "userGroup" = 'User';`);
        this.addSql(`alter table "PageTreeNode" add constraint "PageTreeNode_category_check" check (category in ('mainNavigation', 'topMenu'));`);
        this.addSql(`alter table "PageTreeNode" add constraint "PageTreeNode_userGroup_check" check ("userGroup" in ('all', 'admin', 'user'));`);


        this.addSql(`alter table "Product" drop constraint if exists "Product_type_check";`);
        this.addSql(`update "Product" set type = 'cap' where type = 'Cap';`);
        this.addSql(`update "Product" set type = 'shirt' where type = 'Shirt';`);
        this.addSql(`update "Product" set type = 'tie' where type = 'Tie';`);
        this.addSql(`update "Product" set "additionalTypes" = array_replace("additionalTypes", 'Cap', 'cap');`);
        this.addSql(`update "Product" set "additionalTypes" = array_replace("additionalTypes", 'Shirt', 'shirt');`);
        this.addSql(`update "Product" set "additionalTypes" = array_replace("additionalTypes", 'Tie', 'tie');`);
        this.addSql(`alter table "Product" add constraint "Product_type_check" check (type in ('cap', 'shirt', 'tie'));`);

        this.addSql(`update "PredefinedPage" set type = 'news' where type = 'News';`);

    }
}
