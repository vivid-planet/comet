import { type Request } from "express";

import { type User } from "../../user-permissions/interfaces/user";

export type AuthServiceInterface = {
    authenticateUser: (request: Request) => Promise<User | string | undefined> | User | string | undefined;
};
