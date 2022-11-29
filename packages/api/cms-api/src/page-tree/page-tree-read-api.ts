import { FilterQuery, NotFoundError } from "@mikro-orm/core";
import { PageTreeService } from "src";

import { PageTreeNodeCategory, PageTreeNodeInterface, PageTreeNodeVisibility as Visibility, ScopeInterface } from "./types";
import pathBuilder from "./utils/path-builder";

interface Options {
    category?: PageTreeNodeCategory;
    scope?: ScopeInterface;
    documentType?: string;
}

export interface PageTreeReadApi {
    nodePathById(id: string): Promise<string>;
    nodePath(node: Pick<PageTreeNodeInterface, "id" | "slug" | "parentId">): Promise<string>;
    parentNodes(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]>;
    getNode(id: string): Promise<PageTreeNodeInterface | null>;
    getNodeOrFail(id: string): Promise<PageTreeNodeInterface>;
    getParentNode(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface | null>;
    getNodes(options?: Options): Promise<PageTreeNodeInterface[]>;
    getChildNodes(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]>;
    getNodeByPath(path: string, options?: Options): Promise<PageTreeNodeInterface | null>;
    pageTreeRootNodeList(options?: Options & { excludeHiddenInMenu?: boolean }): Promise<PageTreeNodeInterface[]>;
    getDescendants(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]>;
    getFirstNodeByAttachedPageId(pageId: string): Promise<PageTreeNodeInterface | null>;
}

export function createReadApi(
    pageTreeService: PageTreeService,
    options: {
        visibility?: Visibility | Visibility[] | "all";
    } = {},
): PageTreeReadApi {
    const { visibility = [Visibility.Published] } = options; // @TODO: What is the best default value? 'all' (most needed) or [Published] (safe)
    const visibilityFilter: Array<PageTreeNodeInterface["visibility"]> =
        visibility === "all"
            ? [Visibility.Published, Visibility.Unpublished, Visibility.Archived]
            : typeof visibility === "string"
            ? [visibility]
            : visibility.length === 0 // empty array is not allowed, as someone might unintendedly query all visibilites (empty array means no filter)
            ? [Visibility.Published]
            : [...visibility];

    const pageTreeNodeRepository = pageTreeService.pageTreeRepository;
    const attachedDocumentsRepository = pageTreeService.attachedDocumentsRepository;
    return {
        async nodePathById(id) {
            const node = await this.getNodeOrFail(id);
            return this.nodePath(node);
        },

        async nodePath(node) {
            let parentNode = node;
            const slugs = [node.slug];
            const loopLimit = 5000;
            let count = 0;
            while (parentNode.parentId) {
                if (count >= loopLimit) {
                    throw new Error("Loop limit reached");
                }

                const currentParentNode = await pageTreeNodeRepository.findOne({ id: parentNode.parentId });
                if (!currentParentNode) {
                    throw new Error("Could not find parent");
                }
                parentNode = currentParentNode;
                slugs.push(parentNode.slug);
                count++;
            }

            return pathBuilder(slugs);
        },
        async parentNodes(node) {
            let parentNode: PageTreeNodeInterface | null = node;
            const parentNodes: PageTreeNodeInterface[] = [];
            while (parentNode?.parentId) {
                parentNode = await pageTreeNodeRepository
                    .createQueryBuilder()
                    .where({ id: parentNode.parentId, visibility: visibilityFilter })
                    .getSingleResult();

                if (parentNode) {
                    parentNodes.push(parentNode);
                }
            }

            return parentNodes.reverse();
        },

        async getNode(id) {
            const queryFilter = { id, visibility: { $in: visibilityFilter } };
            const node = await pageTreeNodeRepository.findOne(queryFilter);
            return node ?? null;
        },

        async getNodeOrFail(id) {
            const node = await pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    id,
                    visibility: visibilityFilter,
                })
                .getSingleResult();

            if (!node) {
                throw new NotFoundError("foo");
            }
            return node;
        },

        async getParentNode(node) {
            if (!node.parentId) return null;

            return this.getNodeOrFail(node.parentId);
        },

        async getNodes(options = {}): Promise<PageTreeNodeInterface[]> {
            const qb = pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    visibility: visibilityFilter,
                })
                .orderBy({ pos: "ASC" });

            if (options.category) {
                qb.andWhere({ category: options.category });
            }

            if (options.scope) {
                qb.andWhere({ scope: options.scope });
            }

            if (options.documentType) {
                qb.andWhere({ documentType: options.documentType });
            }

            return qb.getResultList();
        },

        async getChildNodes(node) {
            const nodes = await pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    parentId: node.id,
                    visibility: visibilityFilter,
                })
                .orderBy({ pos: "ASC" })
                .getResultList();

            return nodes;
        },

        async getNodeByPath(path, options = {}) {
            const where: FilterQuery<PageTreeNodeInterface> = { visibility: visibilityFilter };

            if (options.scope) {
                where.scope = options.scope;
            }

            if (path === "/") {
                where.slug = "home";

                const node = await pageTreeNodeRepository.findOne(where);

                if (!node) {
                    return null;
                }

                return node;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any = null;
            let parentId = null;
            for (const slug of path.substr(1).split("/")) {
                where.slug = slug;
                where.parentId = parentId ?? null;

                node = await pageTreeNodeRepository.findOne(where);

                if (!node) return null;
                parentId = node.id;
            }
            return node;
        },
        async pageTreeRootNodeList(options = {}): Promise<PageTreeNodeInterface[]> {
            const qb = pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    parentId: null,
                    visibility: visibilityFilter,
                })
                .orderBy({ pos: "ASC" });

            if (options.scope) {
                qb.andWhere({ scope: options.scope });
            }
            if (options.excludeHiddenInMenu) {
                qb.andWhere({ hideInMenu: false });
            }
            if (options.category) {
                qb.andWhere({ category: options.category });
            }
            const nodes = await qb.getResultList();
            return nodes;
        },

        async getDescendants(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
            const descendants: PageTreeNodeInterface[] = [];

            const childNodes = await this.getChildNodes(node);

            descendants.push(...childNodes);

            for (const childNode of childNodes) {
                descendants.push(...(await this.getDescendants(childNode)));
            }

            return descendants;
        },

        async getFirstNodeByAttachedPageId(pageId: string): Promise<PageTreeNodeInterface | null> {
            const attachedDocument = await attachedDocumentsRepository.findOne({ documentId: pageId });
            const pageTreeNode = await pageTreeNodeRepository.findOne({ id: attachedDocument?.pageTreeNodeId });
            if (pageTreeNode) {
                return pageTreeNode;
            }

            return null;
        },
    };
}
