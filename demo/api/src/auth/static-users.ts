import { type User } from "@comet/cms-api";

export const staticUsers: User[] = [
    {
        id: "1",
        name: "Admin",
        email: "demo@comet-dxp.com",
        isAdmin: true,
    },
    {
        id: "2",
        name: "Non-Admin",
        email: "test@test.com",
        isAdmin: false,
    },
    {
        id: "3",
        name: "One-Permission",
        email: "one@permission.com",
        isAdmin: false,
    },
];
