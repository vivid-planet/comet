import { EntityManager } from "@mikro-orm/postgresql";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly asyncLocalStorage: AsyncLocalStorage<{ tenantId: string }>,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const store = this.asyncLocalStorage.getStore();

        await this.entityManager.begin();

        if (store?.tenantId) {
            await this.entityManager.execute(`SELECT set_config('app.tenant', '${store.tenantId}', TRUE)`);
        }

        return next.handle().pipe(
            map(async (data) => {
                await this.entityManager.commit();
                return data;
            }),
            catchError(async (error) => {
                await this.entityManager.rollback();
                return throwError(() => error);
            }),
        );
    }
}
