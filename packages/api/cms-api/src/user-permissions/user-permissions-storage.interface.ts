import { type CurrentUser } from "./dto/current-user";
import { type SystemUser } from "./user-permissions.types";

export interface UserPermissionsStorage {
    user: CurrentUser | SystemUser;
}
