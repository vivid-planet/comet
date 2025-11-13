import { Migration } from '@mikro-orm/migrations';

export class Migration20241015162102 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE INDEX "Redirect_scope_domain" on "Redirect" ("scope_domain")');
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX "Redirect_scope_domain"');
  }
}
