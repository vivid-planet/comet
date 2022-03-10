import { Inject, Type } from "@nestjs/common";
import { Args, CONTEXT, Context, createUnionType, ID, Mutation, Parent, Query, ResolveField, Resolver, Union } from "@nestjs/graphql";
import { Request } from "express";
import { GraphQLError } from "graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { DocumentInterface } from "../document/dto/document-interface";
import { EmptyPageTreeNodeScope } from "./dto/empty-page-tree-node-scope";
import {
    PageTreeNodeCreateInput,
    PageTreeNodeUpdateInput,
    PageTreeNodeUpdatePositionInput,
    PageTreeNodeUpdateVisibilityInput,
} from "./dto/page-tree-node.input";
import { SlugAvailability } from "./dto/slug-availability.enum";
import { PAGE_TREE_CONFIG } from "./page-tree.constants";
import { PageTreeConfig } from "./page-tree.module";
import { PageTreeReadApi, PageTreeService } from "./page-tree.service";
import { PageTreeNodeCategory, PageTreeNodeInterface, PageTreeNodeVisibility as Visibility, ScopeInterface } from "./types";
import { InMemoryPathResolver } from "./utils/in-memory-path-resolver";

interface PageTreeGQLContext {
    pathResolver?: InMemoryPathResolver;
}

export function createPageTreeResolver({
    PageTreeNode,
    Documents,
    Scope: PassedScope,
    Category,
}: {
    PageTreeNode: Type<PageTreeNodeInterface>;
    Documents: Type<DocumentInterface>[];
    Scope?: Type<ScopeInterface>;
    Category: unknown;
}): Type<unknown> {
    const Scope = PassedScope || EmptyPageTreeNodeScope;
    const hasNonEmptyScope = !!PassedScope;

    function nonEmptyScopeOrNothing(scope: ScopeInterface): ScopeInterface | undefined {
        // GraphQL sends the scope object with a null prototype ([Object: null prototype] { <key>: <value> }), but MikroORM uses the
        // object's hasOwnProperty method internally, resulting in a "object.hasOwnProperty is not a function" error. To fix this, we
        // create a "real" JavaScript object by using the spread operator.
        // See https://github.com/mikro-orm/mikro-orm/issues/2846 for more information.
        return hasNonEmptyScope ? { ...scope } : undefined;
    }

    const pageContentUnion: Union<unknown[]> = createUnionType({
        name: "PageContentUnion",
        types: () => Documents,
    });

    @Resolver(() => PageTreeNode)
    class PageTreeResolver {
        protected pageTreeReadApi: PageTreeReadApi;

        constructor(
            protected readonly pageTreeService: PageTreeService,
            @Inject(CONTEXT) private context: { req: Request },
            @Inject(PAGE_TREE_CONFIG) private readonly config: PageTreeConfig,
        ) {
            const { includeInvisiblePages } = getRequestContextHeadersFromRequest(this.context.req);
            this.pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: [Visibility.Published, ...(includeInvisiblePages || [])],
            });
        }

        @Query(() => PageTreeNode, { nullable: true })
        async pageTreeNode(@Args("id", { type: () => ID }) id: string): Promise<PageTreeNodeInterface> {
            return this.pageTreeReadApi.getNodeOrFail(id);
        }
        @Query(() => PageTreeNode, { nullable: true })
        async pageTreeNodeByPath(
            @Args("path") path: string,
            @Args("scope", { type: () => Scope }) scope: ScopeInterface,
        ): Promise<PageTreeNodeInterface | null> {
            return await this.pageTreeReadApi.getNodeByPath(path, { scope: nonEmptyScopeOrNothing(scope) });
        }

        @Query(() => [PageTreeNode])
        async pageTreeNodeList(
            @Args("scope", { type: () => Scope }) scope: ScopeInterface,
            @Args("category", { type: () => Category, nullable: true }) category: PageTreeNodeCategory,
            @Context() context: PageTreeGQLContext,
        ): Promise<PageTreeNodeInterface[]> {
            const result = await this.pageTreeReadApi.getNodes({ scope: nonEmptyScopeOrNothing(scope), category });
            const pathResolver = new InMemoryPathResolver(result);
            context.pathResolver = pathResolver; // pass pathResolver to upcoming resolver
            return result;
        }

        @Query(() => SlugAvailability)
        async pageTreeNodeSlugAvailable(
            @Args("scope", { type: () => Scope }) scope: ScopeInterface,
            @Args("parentId", { type: () => ID, nullable: true }) parentId: string,
            @Args("slug") slug: string,
        ): Promise<SlugAvailability> {
            const requestedPath = await this.pageTreeService.pathForParentAndSlug(parentId || null, slug);

            if (this.config.reservedPaths.includes(requestedPath)) {
                return SlugAvailability.Reserved;
            }
            const nodeWithSamePath = await this.pageTreeService.nodeWithSamePath(requestedPath, nonEmptyScopeOrNothing(scope));

            if (nodeWithSamePath) {
                return SlugAvailability.Taken;
            }

            return SlugAvailability.Available;
        }

        @ResolveField(() => [PageTreeNode])
        async childNodes(@Parent() node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
            return this.pageTreeReadApi.getChildNodes(node);
        }

        @ResolveField(() => PageTreeNode, { nullable: true })
        async parentNode(@Parent() node: PageTreeNodeInterface): Promise<PageTreeNodeInterface | null> {
            return this.pageTreeReadApi.getParentNode(node);
        }

        @ResolveField(() => String)
        async path(@Parent() node: PageTreeNodeInterface, @Context() context: PageTreeGQLContext): Promise<string> {
            const pathFromMemory = context.pathResolver?.resolve(node.id);
            return (
                pathFromMemory ??
                this.pageTreeService
                    .createReadApi({
                        visibility: "all", // @TODO: Test if "all" is necessary. Actually archived path-names should not be public, now they are.
                    })
                    .nodePath(node)
            );
        }

        @ResolveField(() => [PageTreeNode])
        async parentNodes(@Parent() node: PageTreeNodeInterface): Promise<PageTreeNodeInterface[]> {
            return this.pageTreeReadApi.parentNodes(node);
        }

        @ResolveField(() => pageContentUnion, { nullable: true })
        async document(@Parent() node: PageTreeNodeInterface): Promise<typeof pageContentUnion | undefined> {
            const activeDocument = await this.pageTreeService.getActiveAttachedDocument(node.id, node.documentType);
            if (!activeDocument) {
                return null;
            }
            return this.pageTreeService.resolveDocument(activeDocument.type, activeDocument.documentId);
        }

        @Mutation(() => PageTreeNode)
        async updatePageTreeNode(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => PageTreeNodeUpdateInput }) input: PageTreeNodeUpdateInput,
        ): Promise<PageTreeNodeInterface> {
            // Archived pages cannot be updated
            const pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: "all",
            });
            const node = await pageTreeReadApi.getNodeOrFail(id);
            if (node.visibility === Visibility.Archived) {
                throw new GraphQLError("Can not update an archived page.");
            }

            return this.pageTreeService.updateNode(id, input);
        }

        @Mutation(() => Boolean)
        async deletePageTreeNode(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: "all",
            });
            const pageTreeNode = await pageTreeReadApi.getNodeOrFail(id);

            return this.pageTreeService.delete(pageTreeNode);
        }

        @Mutation(() => PageTreeNode)
        async updatePageTreeNodeVisibility(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => PageTreeNodeUpdateVisibilityInput }) input: PageTreeNodeUpdateVisibilityInput,
        ): Promise<PageTreeNodeInterface> {
            const readApi = this.pageTreeService.createReadApi({ visibility: "all" });

            const existingNode = await readApi.getNodeOrFail(id);
            if (!existingNode) throw new GraphQLError("Can't find page-tree-node with id");

            await this.pageTreeService.updateNodeVisibility(id, input.visibility);

            return await readApi.getNodeOrFail(id);
        }

        @Mutation(() => PageTreeNode)
        async updatePageTreeNodePosition(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => PageTreeNodeUpdatePositionInput }) input: PageTreeNodeUpdatePositionInput,
        ): Promise<PageTreeNodeInterface> {
            // Archived pages cannot be updated
            const pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: "all",
            });
            const node = await pageTreeReadApi.getNodeOrFail(id);
            if (node.visibility === Visibility.Archived) {
                throw new GraphQLError("Can not update an archived page.");
            }

            if (node.slug === "home" && input.parentId !== null) {
                throw new GraphQLError(`Page "home" cannot be moved to subtree`);
            }

            await this.pageTreeService.updateNodePosition(id, input);
            return await this.pageTreeNode(id);
        }

        @Mutation(() => PageTreeNode)
        async updatePageTreeNodeCategory(
            @Args("id", { type: () => ID }) id: string,
            @Args("category", { type: () => Category }) category: PageTreeNodeCategory,
        ): Promise<PageTreeNodeInterface> {
            // Archived pages cannot be updated
            const pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: "all",
            });
            const node = await pageTreeReadApi.getNodeOrFail(id);
            if (node.visibility === Visibility.Archived) {
                throw new GraphQLError("Can not update category of an archived page.");
            }
            await this.pageTreeService.updateCategory(id, category);

            return await this.pageTreeNode(id);
        }

        @Mutation(() => PageTreeNode)
        async createPageTreeNode(
            @Args("input", { type: () => PageTreeNodeCreateInput }) input: PageTreeNodeCreateInput,
            @Args("scope", { type: () => Scope }) scope: ScopeInterface,
            @Args("category", { type: () => Category }) category: PageTreeNodeCategory,
        ): Promise<PageTreeNodeInterface> {
            // Can not add a subpage under an archived page
            if (input.parentId) {
                const pageTreeReadApi = this.pageTreeService.createReadApi({
                    visibility: "all",
                });
                const parentNode = await pageTreeReadApi.getNodeOrFail(input.parentId);
                if (parentNode.visibility === Visibility.Archived) {
                    throw new GraphQLError("Can not add a subpage to an an archived page.");
                }
            }

            const newNode = await this.pageTreeService.createNode(input, category, nonEmptyScopeOrNothing(scope));

            // when no position is passed we are done
            if (!Number.isInteger(input.pos)) {
                return newNode;
            }
            // when a position is passed, update all concerened nodes
            await this.pageTreeService.updateNodePosition(newNode.id, { pos: input.pos as number, parentId: newNode.parentId });
            return await this.pageTreeNode(newNode.id); // refetch new version
        }
    }

    if (hasNonEmptyScope) {
        @Resolver(() => PageTreeNode)
        class ScopedPageTreeResolver extends PageTreeResolver {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            @ResolveField(() => Scope!)
            scope(@Parent() node: PageTreeNodeInterface): ScopeInterface {
                return node.scope as ScopeInterface;
            }
        }

        return ScopedPageTreeResolver;
    }

    return PageTreeResolver;
}
