import { graphql, HttpResponse } from "msw";

import { manufacturers, type Manufacturer } from "./manufacturers";

export type Product = { id: string; name: string; manufacturer: Manufacturer };

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

export const productsQueryHandler = graphql.query<
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
