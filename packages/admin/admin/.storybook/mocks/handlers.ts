import { graphql, HttpResponse } from "msw";

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

const usersQueryHandler = graphql.query<{ users: typeof users }, { query?: string }>("users", ({ variables }) => {
    const query = variables.query?.toLowerCase() ?? "";
    return HttpResponse.json({
        data: {
            users: query ? users.filter((user) => user.name.toLowerCase().includes(query)) : users,
        },
    });
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

export const handlers = [usersQueryHandler, userQueryHandler, manufacturersQueryHandler, productsQueryHandler];
