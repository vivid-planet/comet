import { User } from "@comet/cms-api";

export const staticUsers: User[] = [
    {
        id: "1",
        name: "Admin",
        email: "demo@comet-dxp.com",
        isAdmin: true,
    },
    ...Array(50)
        .fill(0)
        .map((_f, x) => x + 1)
        .map((id) => ({ id: `SU${id}`, name: `Superuser ${id}`, email: `demo_superuser_${id}@comext-dxp.com`, isAdmin: false })),
    ...Array(1000)
        .fill(0)
        .map((_f, x) => x + 1)
        .map((id) => ({ id: `U${id}`, name: `User ${id}`, email: `demo_user_${id}@comet-dxp.com`, isAdmin: false })),
];
