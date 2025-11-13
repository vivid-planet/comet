import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Counter, Histogram } from "@opentelemetry/api";

import { getOrCreateCounter, getOrCreateHistogram } from "./metrics";

// based on https://github.com/hekike/knex-prometheus-exporter/blob/master/lib/knex.js
@Injectable()
export class KnexService {
    private queries: Map<string, { startTime: number }>;
    private sqlQueryErrorCount: Counter;
    private sqlQueryCount: Counter;
    private sqlQueryDuration: Histogram;

    constructor(private entityManager: EntityManager) {
        this.queries = new Map();
        const knex = this.entityManager.getConnection().getKnex();
        knex.on("query", this.onQuery.bind(this));
        knex.on("query-response", this.onQueryResponse.bind(this));
        knex.on("query-error", this.onQueryError.bind(this));

        this.sqlQueryErrorCount = getOrCreateCounter("sql.error.count", {
            description: "Total number SQL queries that resulted in an error",
            unit: "queries",
        });
        this.sqlQueryCount = getOrCreateCounter("sql.query.count", {
            description: "Total number of SQL queries",
            unit: "queries",
        });
        this.sqlQueryDuration = getOrCreateHistogram("sql.query.duration", {
            description: "The duration of SQL queries",
            unit: "ms",
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onQuery(query: any) {
        this.queries.set(query.__knexQueryUid, {
            startTime: performance.now(),
        });
        this.sqlQueryCount.add(1);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onQueryResponse(response: any, query: any) {
        const recordedQuery = this.queries.get(query.__knexQueryUid);
        if (!recordedQuery) {
            return;
        }
        const { startTime } = query;
        this.queries.delete(query.__knexQueryUid);

        const time = performance.now() - startTime;
        this.sqlQueryDuration.record(time);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onQueryError(error: any, query: any) {
        this.queries.delete(query.__knexQueryUid);
        this.sqlQueryErrorCount.add(1);
    }
}
