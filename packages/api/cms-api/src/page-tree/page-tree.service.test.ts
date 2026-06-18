import { describe, expect, it } from "vitest";

import { PageTreeService } from "./page-tree.service";
import { type PageTreeNodeInterface, PageTreeNodeVisibility } from "./types";

function createServiceWithNodes(nodes: PageTreeNodeInterface[]): { service: PageTreeService; andWhereArgs: Array<Record<string, unknown>> } {
    const andWhereArgs: Array<Record<string, unknown>> = [];

    const queryBuilder = {
        where: () => queryBuilder,
        andWhere: (arg: Record<string, unknown>) => {
            andWhereArgs.push(arg);
            return queryBuilder;
        },
        orderBy: () => queryBuilder,
        limit: () => queryBuilder,
        getResultList: async () => {
            const slug = andWhereArgs.find((arg) => "slug" in arg)?.slug;
            return slug !== undefined ? nodes.filter((node) => node.slug === slug) : nodes;
        },
    };

    const pageTreeRepository = { createQueryBuilder: () => queryBuilder };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new PageTreeService(pageTreeRepository as any, {} as any, {} as any, {} as any, {} as any);

    return { service, andWhereArgs };
}

const homeNode = {
    id: "home-id",
    slug: "home",
    parentId: null,
    visibility: PageTreeNodeVisibility.Published,
} as unknown as PageTreeNodeInterface;

describe("PageTreeService", () => {
    describe("nodeWithSamePath", () => {
        it("detects an existing home page when checking the path '/home'", async () => {
            // The home page has the slug "home" but lives at the canonical path "/", so a duplicate
            // check for the path "/home" must still find it (e.g. when copying the home page).
            const { service, andWhereArgs } = createServiceWithNodes([homeNode]);

            await expect(service.nodeWithSamePath("/home")).resolves.toBe(homeNode);
            expect(andWhereArgs).toContainEqual({ slug: "home" });
        });

        it("returns null when no home page exists yet", async () => {
            const { service } = createServiceWithNodes([]);

            await expect(service.nodeWithSamePath("/home")).resolves.toBeNull();
        });
    });
});
