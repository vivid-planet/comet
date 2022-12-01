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
    preloadNodes(scope: ScopeInterface): Promise<void>;
}

// hash from scope object used as key for preloadedNodes Map
function scopeHash(scope: ScopeInterface | undefined): string {
    if (!scope) return "";
    return JSON.stringify(scope);
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
    const preloadedNodes = new Map<string, PageTreeNodeInterface[]>();
    const queryNodes = async (
        scope: ScopeInterface | undefined,
        where: {
            parentId?: string | null;
            excludeHiddenInMenu?: boolean;
            category?: string;
            documentType?: string;
            slug?: string;
        },
    ): Promise<PageTreeNodeInterface[]> => {
        if (scope && preloadedNodes.has(scopeHash(scope))) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            let nodes = preloadedNodes.get(scopeHash(scope))!;
            if (where.parentId !== undefined) {
                nodes = nodes.filter((node) => node.parentId === where.parentId);
            }
            if (where.excludeHiddenInMenu) {
                nodes = nodes.filter((node) => node.hideInMenu === false);
            }
            if (where.category) {
                nodes = nodes.filter((node) => node.category === where.category);
            }
            if (where.documentType) {
                nodes = nodes.filter((node) => node.documentType === where.documentType);
            }
            if (where.slug) {
                nodes = nodes.filter((node) => node.slug === where.slug);
            }
            return nodes;
        } else {
            const qb = pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    visibility: visibilityFilter,
                })
                .orderBy({ pos: "ASC" });

            if (scope) {
                qb.andWhere({ scope });
            }
            if (where.parentId !== undefined) {
                qb.andWhere({ parentId: where.parentId });
            }

            if (where.excludeHiddenInMenu) {
                qb.andWhere({ hideInMenu: false });
            }
            if (where.category) {
                qb.andWhere({ category: where.category });
            }
            if (where.documentType) {
                qb.andWhere({ documentType: where.documentType });
            }
            if (where.slug) {
                qb.andWhere({ slug: where.slug });
            }
            const nodes = await qb.getResultList();
            return nodes;
        }
    };

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
            return queryNodes(options.scope, {
                category: options.category,
                documentType: options.documentType,
            });
        },

        async getChildNodes(node) {
            return queryNodes(node.scope, {
                parentId: node.id,
            });
        },

        async getNodeByPath(path, options = {}) {
            const where: FilterQuery<PageTreeNodeInterface> = { visibility: visibilityFilter };

            if (options.scope) {
                where.scope = options.scope;
            }

            if (path === "/") {
                const nodes = await queryNodes(options.scope, {
                    slug: "home",
                });

                if (!nodes.length) {
                    return null;
                }

                return nodes[0];
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any = null;
            let parentId = null;
            for (const slug of path.substr(1).split("/")) {
                const nodes = await queryNodes(options.scope, {
                    slug,
                    parentId: parentId ?? null,
                });
                node = nodes[0];

                if (!node) return null;
                parentId = node.id;
            }
            return node;
        },
        async pageTreeRootNodeList(options = {}): Promise<PageTreeNodeInterface[]> {
            return queryNodes(options.scope, {
                category: options.category,
                excludeHiddenInMenu: options.excludeHiddenInMenu,
                parentId: null,
            });
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

        async preloadNodes(scope?: ScopeInterface) {
            const qb = pageTreeNodeRepository
                .createQueryBuilder()
                .where({
                    visibility: visibilityFilter,
                })
                .orderBy({ pos: "ASC" });
            qb.andWhere({ scope });
            preloadedNodes.set(scopeHash(scope), await qb.getResultList());
        },
    };
}
