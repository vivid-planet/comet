import { Migration } from '@mikro-orm/migrations';

export class Migration20251212074842 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "Product" add column "tenant" uuid;`);
    this.addSql(`update "Product" set "tenant" = 'f9c86c6c-0625-46c0-9be5-bee3a14cc7f4';`);
    this.addSql(`alter table "Product" alter column "tenant" set not null;`);
    this.addSql(`alter table "Product" add constraint "Product_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);

    this.addSql(`alter table "Manufacturer" add column "tenant" uuid;`);
    this.addSql(`update "Manufacturer" set "tenant" = 'f9c86c6c-0625-46c0-9be5-bee3a14cc7f4';`);
    this.addSql(`alter table "Manufacturer" alter column "tenant" set not null;`);
    this.addSql(`alter table "Manufacturer" add constraint "Manufacturer_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);

    // enable and force Row level security for the tenant and tenantscope table
    this.addSql(`alter table "Tenant" enable row level security;`);
    this.addSql(`alter table "Tenant" force row level security;`);
    this.addSql(`alter table "Department" enable row level security;`);
    this.addSql(`alter table "Department" force row level security;`);
    this.addSql(`alter table "Product" enable row level security;`);
    this.addSql(`alter table "Product" force row level security;`);
    this.addSql(`alter table "Product_datasheets" enable row level security;`);
    this.addSql(`alter table "Product_datasheets" force row level security;`);
    this.addSql(`alter table "Product_tags" enable row level security;`);
    this.addSql(`alter table "Product_tags" force row level security;`);
    this.addSql(`alter table "ProductCategory" enable row level security;`);
    this.addSql(`alter table "ProductCategory" force row level security;`);
    this.addSql(`alter table "ProductCategoryType" enable row level security;`);
    this.addSql(`alter table "ProductCategoryType" force row level security;`);
    this.addSql(`alter table "ProductColor" enable row level security;`);
    this.addSql(`alter table "ProductColor" force row level security;`);
    this.addSql(`alter table "ProductHighlight" enable row level security;`);
    this.addSql(`alter table "ProductHighlight" force row level security;`);
    this.addSql(`alter table "ProductStatistics" enable row level security;`);
    this.addSql(`alter table "ProductStatistics" force row level security;`);
    this.addSql(`alter table "ProductTag" enable row level security;`);
    this.addSql(`alter table "ProductTag" force row level security;`);
    this.addSql(`alter table "ProductToTag" enable row level security;`);
    this.addSql(`alter table "ProductToTag" force row level security;`);
    this.addSql(`alter table "ProductVariant" enable row level security;`);
    this.addSql(`alter table "ProductVariant" force row level security;`);
    this.addSql(`alter table "Manufacturer" enable row level security;`);
    this.addSql(`alter table "Manufacturer" force row level security;`);

    // Add policies
    this.addSql(`create policy TenantIsolationPolicy on "Tenant" for all using (id = current_setting('app.tenant')::uuid) with check (id = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy DepartmentTenantIsolationPolicy on "Department" for all using (tenant = current_setting('app.tenant')::uuid) with check (tenant = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy ProductTenantIsolationPolicy on "Product" for all using (tenant = current_setting('app.tenant')::uuid) with check (tenant = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy ProductDatasheetsTenantIsolationPolicy on "Product_datasheets" for all using (exists (select 1 from "Product" where "Product".id = "Product_datasheets".product and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductTagsTenantIsolationPolicy on "Product_tags" for all using (exists (select 1 from "Product" where "Product".id = "Product_tags".product and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductCategoryTenantIsolationPolicy on "ProductCategory" for all using (exists (select 1 from "Product" where "Product".category = "ProductCategory".id and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductCategoryTypeTenantIsolationPolicy on "ProductCategoryType" for all using (exists (select 1 from "Product" inner join "ProductCategory" on "Product".category = "ProductCategory".id where "ProductCategory".type = "ProductCategoryType".id and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductColorTenantIsolationPolicy on "ProductColor" for all using (product = current_setting('app.tenant')::uuid) with check (product = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy ProductHighlightTenantIsolationPolicy on "ProductHighlight" for all using (product = current_setting('app.tenant')::uuid) with check (product = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy ProductStatisticsTenantIsolationPolicy on "ProductStatistics" for all using (exists (select 1 from "Product" where "Product".statistics = "ProductStatistics".id and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductTagTenantIsolationPolicy on "ProductTag" for all using (exists (select 1 from "Product" inner join "Product_tags" on "Product".id = "Product_tags".product where "Product_tags"."productTag" = "ProductTag".id and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductToTagTenantIsolationPolicy on "ProductToTag" for all using (exists (select 1 from "Product" where "Product".id = "ProductToTag".product and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ProductVariantTenantIsolationPolicy on "ProductVariant" for all using (exists (select 1 from "Product" where "Product".id = "ProductVariant".product and "Product".tenant = current_setting('app.tenant')::uuid)) `);
    this.addSql(`create policy ManufacturerTenantIsolationPolicy on "Manufacturer" for all using (tenant = current_setting('app.tenant')::uuid) with check (tenant = current_setting('app.tenant')::uuid);`);
  }

}
