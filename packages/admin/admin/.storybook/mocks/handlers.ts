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

const usersQueryHandler = graphql.query<{ users: typeof users }, { query?: string; sort?: string; order?: string }>("users", ({ variables }) => {
    const query = variables.query?.toLowerCase() ?? "";
    let result = query ? users.filter((user) => user.name.toLowerCase().includes(query)) : [...users];

    if (variables.sort && variables.order) {
        const sort = variables.sort as keyof (typeof users)[0];
        result = result.sort((a, b) => {
            const aVal = String(a[sort] ?? "");
            const bVal = String(b[sort] ?? "");
            return variables.order === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
    }

    return HttpResponse.json({ data: { users: result } });
});

const usersRestHandler = http.get("/users", () => {
    return HttpResponse.json(users);
});

const userQueryHandler = graphql.query<{ user: (typeof users)[number] | null }, { id: number }>("user", ({ variables }) => {
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

const productsQueryHandler = graphql.query<{ products: Product[] }, { manufacturer?: string }>("Products", ({ variables }) => {
    const manufacturerId = variables.manufacturer;
    return HttpResponse.json({
        data: {
            products: manufacturerId ? products.filter((p) => p.manufacturer.id === manufacturerId) : products,
        },
    });
});

export type Launch = {
    id: string;
    mission_name: string;
    launch_date_local: string;
};

export type LaunchesPastResult = {
    data: Launch[];
    result: { totalCount: number };
};

export type LaunchesPastPagePagingResult = {
    nodes: Launch[];
    totalCount: number;
    nextPage?: number;
    previousPage?: number;
    totalPages?: number;
};

const allLaunches: Launch[] = Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
    mission_name: `Mission ${i + 1}`,
    launch_date_local: new Date(2015 + Math.floor(i / 20), i % 12, (i % 28) + 1).toISOString(),
}));

const launchesPastResultHandler = graphql.query<
    { launchesPastResult: LaunchesPastResult },
    { limit?: number; offset?: number; sort?: string; order?: string }
>("LaunchesPast", ({ variables }) => {
    const { limit = 100, offset = 0, sort, order } = variables;
    let launches = [...allLaunches];

    if (sort && order) {
        launches = launches.sort((a, b) => {
            const aVal = String(a[sort as keyof Launch] ?? "");
            const bVal = String(b[sort as keyof Launch] ?? "");
            return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
    }

    return HttpResponse.json({
        data: {
            launchesPastResult: {
                data: launches.slice(offset, offset + limit),
                result: { totalCount: launches.length },
            },
        },
    });
});

const launchesPastPagePagingHandler = graphql.query<
    { launchesPastPagePaging: LaunchesPastPagePagingResult },
    { page?: number; size?: number }
>("LaunchesPastPagePaging", ({ variables }) => {
    const page = variables.page ?? 1;
    const size = variables.size ?? 20;
    const launches = [...allLaunches];
    const totalCount = launches.length;

    return HttpResponse.json({
        data: {
            launchesPastPagePaging: {
                nodes: launches.slice((page - 1) * size, page * size),
                totalCount,
                nextPage: totalCount > page * size ? page + 1 : undefined,
                previousPage: page > 1 ? page - 1 : undefined,
                totalPages: Math.ceil(totalCount / size),
            },
        },
    });
});

export type Photo = { id: number; albumId: number; title: string; thumbnailUrl: string };

const allPhotos: Photo[] = Array.from({ length: 5000 }, (_, i) => ({
    id: i + 1,
    albumId: Math.floor(i / 50) + 1,
    title: `Photo ${i + 1}`,
    thumbnailUrl: `https://via.placeholder.com/150/dddddd/000000?text=${i + 1}`,
}));

const photosQueryHandler = graphql.query<{ photos: Photo[] }, { start?: number; limit?: number; query?: string }>(
    "photos",
    ({ variables }) => {
        const start = variables.start ?? 0;
        const limit = variables.limit ?? 50;
        const query = variables.query?.toLowerCase() ?? "";
        let photos = query ? allPhotos.filter((p) => p.title.toLowerCase().includes(query)) : allPhotos;
        return HttpResponse.json({ data: { photos: photos.slice(start, start + limit) } });
    },
);

export type StarWarsPerson = {
    id: string;
    name: string;
    birthYear: string;
    gender: string;
    homeworld: { name: string };
};

const starWarsPeople: StarWarsPerson[] = [
    { id: "1", name: "Luke Skywalker", birthYear: "19BBY", gender: "male", homeworld: { name: "Tatooine" } },
    { id: "2", name: "C-3PO", birthYear: "112BBY", gender: "n/a", homeworld: { name: "Tatooine" } },
    { id: "3", name: "R2-D2", birthYear: "33BBY", gender: "n/a", homeworld: { name: "Naboo" } },
    { id: "4", name: "Darth Vader", birthYear: "41.9BBY", gender: "male", homeworld: { name: "Tatooine" } },
    { id: "5", name: "Leia Organa", birthYear: "19BBY", gender: "female", homeworld: { name: "Alderaan" } },
];

const starWarsPeopleHandler = graphql.query<{ allPeople: { people: StarWarsPerson[] } }>("StarWarsPeople", () =>
    HttpResponse.json({ data: { allPeople: { people: starWarsPeople } } }),
);

export const handlers = [
    usersQueryHandler,
    usersRestHandler,
    userQueryHandler,
    manufacturersQueryHandler,
    productsQueryHandler,
    launchesPastResultHandler,
    launchesPastPagePagingHandler,
    photosQueryHandler,
    starWarsPeopleHandler,
];
