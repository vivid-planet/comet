import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Type } from "@nestjs/common";
import { Args, CONTEXT, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { validateNotModified } from "../document/validateNotModified";
import { PageTreeReadApi, PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeInterface, PageTreeNodeVisibility } from "../page-tree/types";
import { RedirectArgs } from "./dto/redirect.args";
import { CreateRedirectInput, RedirectUpdateActivenessInput, UpdateRedirectInput } from "./dto/redirect.input";
import { Redirect } from "./entities/redirect.entity";
import { RedirectsService } from "./redirects.service";

export function createRedirectsResolver(PageTreeNode: Type<PageTreeNodeInterface>): Type<unknown> {
    @Resolver(() => Redirect)
    class RedirectsResolver {
        protected pageTreeReadApi: PageTreeReadApi;

        constructor(
            private readonly redirectService: RedirectsService,
            @InjectRepository(Redirect) private readonly repository: EntityRepository<Redirect>,
            @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
            @Inject(CONTEXT) private context: { req: Request },
        ) {
            const { includeInvisiblePages } = getRequestContextHeadersFromRequest(this.context.req);
            this.pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
            });
        }

        @Query(() => [Redirect])
        async redirects(@Args() { query, type, active }: RedirectArgs): Promise<Redirect[]> {
            const where = this.redirectService.getFindCondition({ query, type, active });
            return this.repository.find(where);
        }

        @Query(() => Redirect)
        async redirect(@Args("id", { type: () => ID }) id: string): Promise<Redirect | null> {
            const redirect = await this.repository.findOne(id);
            return redirect ?? null;
        }

        @Mutation(() => Redirect)
        async createRedirect(@Args("input", { type: () => CreateRedirectInput }) input: CreateRedirectInput): Promise<Redirect> {
            const entity = this.repository.create(input);
            await this.repository.persistAndFlush(entity);
            return this.repository.findOneOrFail(entity.id);
        }

        @Mutation(() => Redirect)
        async updateRedirect(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => UpdateRedirectInput }) input: UpdateRedirectInput,
            @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        ): Promise<Redirect> {
            const redirect = await this.repository.findOneOrFail(id);
            if (redirect != null && lastUpdatedAt) {
                validateNotModified(redirect, lastUpdatedAt);
            }

            redirect.assign(input);
            await this.repository.persistAndFlush(redirect);
            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Redirect)
        async updateRedirectActiveness(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectUpdateActivenessInput }) input: RedirectUpdateActivenessInput,
        ): Promise<Redirect> {
            const redirect = await this.repository.findOneOrFail(id);

            redirect.assign({ active: input.active });
            await this.repository.persistAndFlush(redirect);

            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Boolean)
        async deleteRedirect(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const entity = await this.repository.findOneOrFail(id);
            await this.repository.removeAndFlush(entity);
            return true;
        }

        @ResolveField(() => PageTreeNode, { nullable: true })
        async targetPage(@Parent() { targetPageId }: Redirect): Promise<PageTreeNodeInterface | null> {
            if (!targetPageId) {
                return null;
            }

            return this.pageTreeReadApi.getNode(targetPageId);
        }
    }

    return RedirectsResolver;
}
