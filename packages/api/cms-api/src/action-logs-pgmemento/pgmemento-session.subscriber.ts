import { EntityManager, type EventSubscriber, PostgreSqlDriver, type TransactionEventArgs } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { UserPermissionsStorageService } from "../user-permissions/user-permissions-storage.service";
import { PGMEMENTO_SESSION_USER_KEY } from "./pgmemento.constants";

/**
 * Replaces the snapshot-building work that the old `ActionLogsSubscriber` did on every flush.
 *
 * pgMemento writes the audit trail itself, inside the database, via triggers. The only thing it
 * cannot know is _which application user_ caused a change — the database only sees a single
 * technical connection user. We provide that by writing the acting user into the transaction-local
 * GUC `pgmemento.session_info`, which pgMemento copies into `transaction_log.session_info`.
 *
 * We set it in `afterTransactionStart` so it is the first statement of every transaction and lives
 * on the exact connection that will run the following writes — which makes it robust against
 * connection pooling. It does not matter when exactly pgMemento writes the log row afterwards.
 */
@Injectable()
export class PgMementoSessionSubscriber implements EventSubscriber {
    constructor(
        entityManager: EntityManager<PostgreSqlDriver>,
        private readonly userPermissionsStorageService: UserPermissionsStorageService,
    ) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    async afterTransactionStart(args: TransactionEventArgs): Promise<void> {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return;
        }

        const sessionInfo = JSON.stringify({ [PGMEMENTO_SESSION_USER_KEY]: userId });
        await (args.em as EntityManager<PostgreSqlDriver>).execute("select set_config('pgmemento.session_info', ?, true)", [sessionInfo]);
    }

    private getCurrentUserId(): string | undefined {
        if (!this.userPermissionsStorageService.has("user")) {
            return undefined;
        }
        const user = this.userPermissionsStorageService.get("user");
        return typeof user === "string" ? user : user?.id;
    }
}
