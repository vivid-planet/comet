import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";
import { Request } from "express";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { AttachedDocument } from "./entities/attached-document.entity";
import { PAGE_TREE_REPOSITORY } from "./page-tree.constants";
import { createReadApi, PageTreeReadApi, PageTreeReadApiOptions } from "./page-tree-read-api";
import { PageTreeNodeInterface, PageTreeNodeVisibility as Visibility, ScopeInterface } from "./types";

@Injectable()
export class PageTreeReadApiService {
    private api: PageTreeReadApi;
    constructor(
        @Inject(forwardRef(() => PAGE_TREE_REPOSITORY)) public readonly pageTreeRepository: EntityRepository<PageTreeNodeInterface>,
        @InjectRepository(AttachedDocument) public readonly attachedDocumentsRepository: EntityRepository<AttachedDocument>,
        @Inject(CONTEXT) private context: { req: Request } | undefined,
    ) {
        let includeInvisiblePages: Visibility[] = [];
        if (this.context) {
            const ctx = getRequestContextHeadersFromRequest(this.context.req);
            includeInvisiblePages = ctx.includeInvisiblePages || [];
        }
        this.api = createReadApi(
            {
                pageTreeNodeRepository: this.pageTreeRepository,
                attachedDocumentsRepository: this.attachedDocumentsRepository,
            },
            {
                visibility: [Visibility.Published, ...includeInvisiblePages],
            },
        );
    }
    async nodePathById(id: string): Promise<string> {
        return this.api.nodePathById(id);
    }
    async nodePath(node: Pick<PageTreeNodeInterface, "id" | "slug" | "parentId" | "scope">): Promise<string> {
        return this.api.nodePath(node);
    }
    async parentNodes(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
        return this.api.parentNodes(node);
    }
    async getNode(id: string): Promise<PageTreeNodeInterface | null> {
        return this.api.getNode(id);
    }
    async getNodeOrFail(id: string): Promise<PageTreeNodeInterface> {
        return this.api.getNodeOrFail(id);
    }
    async getParentNode(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface | null> {
        return this.api.getParentNode(node);
    }
    async getNodes(options?: PageTreeReadApiOptions): Promise<PageTreeNodeInterface[]> {
        return this.api.getNodes(options);
    }
    async getChildNodes(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
        return this.api.getChildNodes(node);
    }
    async getNodeByPath(path: string, options?: PageTreeReadApiOptions): Promise<PageTreeNodeInterface | null> {
        return this.api.getNodeByPath(path, options);
    }
    async pageTreeRootNodeList(options?: PageTreeReadApiOptions & { excludeHiddenInMenu?: boolean }): Promise<PageTreeNodeInterface[]> {
        return this.api.pageTreeRootNodeList(options);
    }
    async getDescendants(node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
        return this.api.getDescendants(node);
    }
    async getFirstNodeByAttachedPageId(pageId: string): Promise<PageTreeNodeInterface | null> {
        return this.api.getFirstNodeByAttachedPageId(pageId);
    }
    async preloadNodes(scope: ScopeInterface): Promise<void> {
        return this.api.preloadNodes(scope);
    }
}
