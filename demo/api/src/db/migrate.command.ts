import { MikroORM } from "@mikro-orm/postgresql";
import { Command, CommandRunner } from "nest-commander";

@Command({ name: "migrate", description: "Runs all migrations" })
export class MigrateCommand extends CommandRunner {
    constructor(private readonly orm: MikroORM) {
        super();
    }

    private async sleep(s: number): Promise<unknown> {
        return new Promise((resolve) => {
            setTimeout(resolve, s * 1000);
        });
    }

    async run(): Promise<void> {
        console.log("Running migrations...");
        const em = this.orm.em.fork();

        try {
            // as our application can have multiple replicas, we need to make sure, migrations are executed only once
            await em.begin();

            const connection = em.getConnection();
            // we can't use MikroORM's migrations table as lock object, because it does not exist on first run, so we bring our own lock object
            await connection.execute(
                `CREATE TABLE IF NOT EXISTS "migrations_lock" ("id" int NOT NULL, PRIMARY KEY ("id"))`,
                undefined,
                undefined,
                em.getTransactionContext(),
            );

            let lockTries = 0;
            let lockAquired = false;
            while (!lockAquired) {
                try {
                    // we lock in exclusive mode, so any other transactions fails immediatly (NOWAIT)
                    // lock gets automatically released on commit or rollback
                    await connection.execute(
                        `LOCK TABLE "migrations_lock" IN EXCLUSIVE MODE NOWAIT`,
                        undefined,
                        undefined,
                        em.getTransactionContext(),
                    );
                    lockAquired = true;
                } catch (error) {
                    await em.rollback();
                    console.warn(error);
                    console.warn(`Cannot aquire lock for table migrations_lock (try ${++lockTries})`);
                    if (lockTries > 3600) {
                        console.error(`Giving up...`);
                        throw new Error("Could not aquire lock for table migrations_locks");
                    }
                    await this.sleep(1);
                    await em.begin(em.getTransactionContext());
                }
            }
            const migrator = this.orm.getMigrator();
            await migrator.up({
                transaction: em.getTransactionContext(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any); // https://mikro-orm.io/docs/migrations/#providing-transaction-context

            console.log(`Executed migrations. Trying to commit...`);
            await em.commit();
            console.log("Migrations successfully committed");
        } catch (error) {
            console.error(error);
            await em.rollback();

            // we need to fail with non-zero exit-code, so migrations will be retried by kubernetes with exponantial back-off
            process.exit(-1);
        }
    }
}
