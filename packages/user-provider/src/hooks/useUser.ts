import * as React from "react";
import { IUser } from "./createUserContextApi";
import UserContext from "./UserContext";

export function useUser<TUser extends IUser>(): TUser | null {
    const userContext = React.useContext(UserContext);
    if (userContext.user) {
        return userContext.user as TUser;
    } else {
        return null;
    }
}
export function useHasRole(role: string) {
    const userContext = React.useContext(UserContext);
    return userContext.user ? userContext.user.roles.indexOf(role) !== -1 : false;
}
export function useUserRoles() {
    const userContext = React.useContext(UserContext);
    if (userContext.user) {
        return userContext.user.roles;
    } else {
        return null;
    }
}
