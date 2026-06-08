import { graphql, http, HttpResponse } from "msw";

const users = [
    { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz" },
    { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv" },
    { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net" },
    { id: 4, name: "Patricia Lebsack", username: "Karianne", email: "Julianne.OConner@kory.org" },
    { id: 5, name: "Chelsey Dietrich", username: "Kamren", email: "Lucio_Hettinger@annie.ca" },
    { id: 6, name: "Mrs. Dennis Schulist", username: "Leopoldo_Corkery", email: "Karley_Dach@jasper.info" },
    { id: 7, name: "Kurtis Weissnat", username: "Elwyn.Skiles", email: "Telly.Hoeger@billy.biz" },
    { id: 8, name: "Nicholas Runolfsdottir V", username: "Maxime_Nienow", email: "Sherwood@rosamond.me" },
    { id: 9, name: "Glenna Reichert", username: "Delphine", email: "Chaim_McDermott@dana.io" },
    { id: 10, name: "Clementina DuBuque", username: "Moriah.Stanton", email: "Rey.Padberg@karina.biz" },
];

type User = (typeof users)[number];

const usersQueryHandler = graphql.query<{ users: User[] }, { query?: string; sort?: string; order?: string }>("users", ({ variables }) => {
    const query = variables.query?.toLowerCase() ?? "";
    const sort = variables.sort;
    const order = variables.order?.toUpperCase() ?? "ASC";

    let result = query ? users.filter((user) => user.name.toLowerCase().includes(query)) : [...users];

    if (sort) {
        result = result.sort((a, b) => {
            const aVal = a[sort as keyof User] as string | number;
            const bVal = b[sort as keyof User] as string | number;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === "DESC" ? -cmp : cmp;
        });
    }

    return HttpResponse.json({
        data: { users: result },
    });
});

const userQueryHandler = graphql.query<{ user: User | null }, { id: number }>("user", ({ variables }) => {
    return HttpResponse.json({
        data: {
            user: users.find((user) => user.id === variables.id) ?? null,
        },
    });
});

export type Manufacturer = { id: string; name: string };
export type Product = { id: string; name: string; manufacturer: Manufacturer };

const manufacturers: Manufacturer[] = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "TechVision" },
    { id: "3", name: "BuildCraft" },
    { id: "4", name: "NovaTech" },
    { id: "5", name: "Apex Industries" },
];

const products: Product[] = [
    { id: "1", name: "Widget A", manufacturer: manufacturers[0] },
    { id: "2", name: "Widget B", manufacturer: manufacturers[0] },
    { id: "3", name: "Vision Pro", manufacturer: manufacturers[1] },
    { id: "4", name: "Vision Lite", manufacturer: manufacturers[1] },
    { id: "5", name: "BuildKit X", manufacturer: manufacturers[2] },
    { id: "6", name: "BuildKit Y", manufacturer: manufacturers[2] },
    { id: "7", name: "NovaOne", manufacturer: manufacturers[3] },
    { id: "8", name: "NovaTwo", manufacturer: manufacturers[3] },
    { id: "9", name: "Apex Alpha", manufacturer: manufacturers[4] },
    { id: "10", name: "Apex Beta", manufacturer: manufacturers[4] },
];

const manufacturersQueryHandler = graphql.query<{ manufacturers: Manufacturer[] }, { search?: string }>("Manufacturers", ({ variables }) => {
    const search = variables.search?.toLowerCase() ?? "";
    return HttpResponse.json({
        data: {
            manufacturers: search ? manufacturers.filter((m) => m.name.toLowerCase().includes(search)) : manufacturers,
        },
    });
});

const productsQueryHandler = graphql.query<
    { products: { nodes: Product[]; totalCount: number } },
    { offset?: number; limit?: number; search?: string; manufacturer?: string; sort?: { field: keyof Product; direction: "ASC" | "DESC" }[] }
>("products", ({ variables }) => {
    const offset = variables.offset ?? 0;
    const search = variables.search?.toLowerCase() ?? "";
    const sort = variables.sort ?? [];

    let result = [...products];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search));
    if (variables.manufacturer) result = result.filter((p) => p.manufacturer.id === variables.manufacturer);

    for (const { field, direction } of [...sort].reverse()) {
        result = result.sort((a, b) => {
            const aVal = String(a[field] ?? "");
            const bVal = String(b[field] ?? "");
            const cmp = aVal.localeCompare(bVal);
            return direction === "DESC" ? -cmp : cmp;
        });
    }

    const totalCount = result.length;
    const nodes = variables.limit !== undefined ? result.slice(offset, offset + variables.limit) : result;

    return HttpResponse.json({
        data: { products: { nodes, totalCount } },
    });
});

const launchesQueryHandler = http.get("/launches", () => {
    return HttpResponse.json([
        { id: "1", name: "FalconSat", date: "2006-03-24" },
        { id: "2", name: "DemoSat", date: "2007-03-21" },
        { id: "3", name: "Trailblazer", date: "2008-08-03" },
    ]);
});

const usersWithPagingHandler = graphql.query<
    {
        usersWithPaging: {
            nodes: User[];
            totalCount: number;
            nextPage?: number;
            previousPage?: number;
            totalPages?: number;
        };
    },
    { query?: string; sort?: string; order?: string; page?: number; size?: number }
>("UsersWithPaging", ({ variables }) => {
    const query = variables.query?.toLowerCase() ?? "";
    const sort = variables.sort;
    const order = variables.order?.toUpperCase() ?? "ASC";
    const page = variables.page ?? 1;
    const size = variables.size ?? 5;

    let filtered = query ? users.filter((user) => user.name.toLowerCase().includes(query)) : [...users];

    if (sort) {
        filtered = filtered.sort((a, b) => {
            const aVal = a[sort as keyof User] as string | number;
            const bVal = b[sort as keyof User] as string | number;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === "DESC" ? -cmp : cmp;
        });
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / size);
    const nodes = filtered.slice((page - 1) * size, page * size);

    return HttpResponse.json({
        data: {
            usersWithPaging: {
                nodes,
                totalCount,
                totalPages,
                nextPage: page < totalPages ? page + 1 : undefined,
                previousPage: page > 1 ? page - 1 : undefined,
            },
        },
    });
});

export const handlers = [usersQueryHandler, userQueryHandler, manufacturersQueryHandler, productsQueryHandler, launchesQueryHandler, usersWithPagingHandler];
