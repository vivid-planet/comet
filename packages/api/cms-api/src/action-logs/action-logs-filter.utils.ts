import type { ObjectQuery } from "@mikro-orm/postgresql";

import { filtersToMikroOrmQuery } from "../common/filter/mikro-orm";
import type { ActionLogFilter } from "./dto/action-log.filter";
import { ActionLogAction } from "./dto/action-log-action.enum";
import type { ActionLog } from "./entities/action-log.entity";

function actionToWhere(action: ActionLogAction): ObjectQuery<ActionLog> {
    switch (action) {
        case ActionLogAction.Created:
            return { version: 1, snapshot: { $ne: null } };
        case ActionLogAction.Updated:
            return { version: { $gt: 1 }, snapshot: { $ne: null } };
        case ActionLogAction.Deleted:
            return { snapshot: null };
    }
}

export function actionLogFilterToWhere(filter: ActionLogFilter): ObjectQuery<ActionLog> {
    const andConditions: ObjectQuery<ActionLog>[] = [];

    if (filter.action) {
        if (filter.action.equal !== undefined) {
            andConditions.push(actionToWhere(filter.action.equal));
        }
        if (filter.action.isAnyOf !== undefined && filter.action.isAnyOf.length > 0) {
            andConditions.push({ $or: filter.action.isAnyOf.map(actionToWhere) });
        }
        if (filter.action.notEqual !== undefined) {
            andConditions.push({ $not: actionToWhere(filter.action.notEqual) });
        }
    }

    const { action: _action, and, or, ...rest } = filter;
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
