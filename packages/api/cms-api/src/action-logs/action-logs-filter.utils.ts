import type { ObjectQuery } from "@mikro-orm/postgresql";

import { filtersToMikroOrmQuery } from "../common/filter/mikro-orm";
import type { ActionLogFilter } from "./dto/action-log.filter";
import type { ActionLog } from "./entities/action-log.entity";

export function actionLogFilterToWhere(filter: ActionLogFilter): ObjectQuery<ActionLog> {
    const andConditions: ObjectQuery<ActionLog>[] = [];

    const { and, or, ...rest } = filter;
    if (Object.keys(rest).length > 0) {
        andConditions.push(filtersToMikroOrmQuery(rest));
    }

    if (and && and.length > 0) {
        andConditions.push({ $and: and.map(actionLogFilterToWhere) });
    }
    if (or && or.length > 0) {
        andConditions.push({ $or: or.map(actionLogFilterToWhere) });
    }

    if (andConditions.length === 0) {
        return {};
    }
    if (andConditions.length === 1) {
        return andConditions[0];
    }
    return { $and: andConditions };
}
