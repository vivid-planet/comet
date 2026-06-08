import { launchesQueryHandler } from "./handlers/launches";
import { manufacturersQueryHandler } from "./handlers/manufacturers";
import { productsQueryHandler } from "./handlers/products";
import { usersQueryHandler, userQueryHandler } from "./handlers/users";
import { usersWithPagingHandler } from "./handlers/usersWithPaging";

export type { Manufacturer } from "./handlers/manufacturers";
export type { Product } from "./handlers/products";

export const handlers = [
    usersQueryHandler,
    userQueryHandler,
    manufacturersQueryHandler,
    productsQueryHandler,
    launchesQueryHandler,
    usersWithPagingHandler,
];
