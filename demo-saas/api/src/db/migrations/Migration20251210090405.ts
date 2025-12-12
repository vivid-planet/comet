import { Migration } from '@mikro-orm/migrations';

export class Migration20251210090405 extends Migration {

  override async up(): Promise<void> {
    // enable and force Row level security for the tenant and tenantscope table
    this.addSql(`alter table "Tenant" enable row level security;`);
    this.addSql(`alter table "Tenant" force row level security;`);
    this.addSql(`alter table "Department" enable row level security;`);
    this.addSql(`alter table "Department" force row level security;`);

    // Add policies
    this.addSql(`create policy TenantIsolationPolicy on "Tenant" for all using (id = current_setting('app.tenant')::uuid) with check (id = current_setting('app.tenant')::uuid);`);
    this.addSql(`create policy TenantScopeIsolationPolicy on "Department" for all using (tenant = current_setting('app.tenant')::uuid) with check (tenant = current_setting('app.tenant')::uuid);`);
    
    // this is for tables that have a tenant field
    /*
    this.addSql(`CREATE POLICY tenant_isolation_policy ON "Product" FOR ALL 
                  USING (tenant = current_setting('app.tenant')::uuid) 
                  WITH CHECK (tenant = current_setting('app.tenant')::uuid);`);
    */


    // this is for tables that have a relation to a table that has a tenant field
    /*
CREATE POLICY "ProductVariant_Policy"
ON "ProductVariant"
USING (
    EXISTS (
        SELECT 1
        FROM "Product"
        WHERE "Product".id = "ProductVariant".product
        AND "Product".tenant = current_setting('app.tenant')::uuid
    )
);
    */
  }

}
