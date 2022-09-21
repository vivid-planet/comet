import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Type } from "@nestjs/common";
import { Args, CONTEXT, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request } from "express";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { CometValidationException } from "../common/errors/validation.exception";
import { validateNotModified } from "../document/validateNotModified";
import { PageTreeReadApi, PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeVisibility } from "../page-tree/types";
import { RedirectArgs } from "./dto/redirect.args";
import { RedirectInputInterface } from "./dto/redirect-input.factory";
import { RedirectUpdateActivenessInput } from "./dto/redirect-update-activeness.input";
import { RedirectInterface } from "./entities/redirect-entity.factory";
import { RedirectsService } from "./redirects.service";

export function createRedirectsResolver(Redirect: Type<RedirectInterface>, RedirectInput: Type<RedirectInputInterface>): Type<unknown> {
    @Resolver(() => Redirect)
    class RedirectsResolver {
        protected pageTreeReadApi: PageTreeReadApi;

        constructor(
            private readonly redirectService: RedirectsService,
            @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
            @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
            @Inject(CONTEXT) private context: { req: Request },
        ) {
            const { includeInvisiblePages } = getRequestContextHeadersFromRequest(this.context.req);
            this.pageTreeReadApi = this.pageTreeService.createReadApi({
                visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
            });
        }

        @Query(() => [Redirect])
        async redirects(@Args() { query, type, active, sortColumnName, sortDirection }: RedirectArgs): Promise<RedirectInterface[]> {
            const where = this.redirectService.getFindCondition({ query, type, active });

            const options: FindOptions<RedirectInterface> = {};
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }

            return this.repository.find(where, options);
        }

        @Query(() => Redirect)
        async redirect(@Args("id", { type: () => ID }) id: string): Promise<RedirectInterface | null> {
            const redirect = await this.repository.findOne(id);
            return redirect ?? null;
        }

        @Query(() => Boolean)
        async redirectSourceAvailable(@Args("source", { type: () => String }) source: string): Promise<boolean> {
            const redirect = await this.repository.findOne({ source });
            return redirect === null;
        }

        @Mutation(() => Redirect)
        async createRedirect(@Args("input", { type: () => RedirectInput }) input: RedirectInputInterface): Promise<RedirectInterface> {
            const tranformedInput = plainToInstance(RedirectInput, input);

            const errors = await validate(tranformedInput, { whitelist: true, forbidNonWhitelisted: true });

            if (errors.length > 0) {
                throw new CometValidationException("Validation failed", errors);
            }

            const entity = this.repository.create({ ...tranformedInput, target: tranformedInput.target.transformToBlockData() });
            await this.repository.persistAndFlush(entity);
            return this.repository.findOneOrFail(entity.id);
        }

        @Mutation(() => Redirect)
        async updateRedirect(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectInput }) input: RedirectInputInterface,
            @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        ): Promise<RedirectInterface> {
            const tranformedInput = plainToInstance(RedirectInput, input);

            const errors = await validate(tranformedInput, { whitelist: true, forbidNonWhitelisted: true });

            if (errors.length > 0) {
                throw new CometValidationException("Validation failed", errors);
            }

            const redirect = await this.repository.findOneOrFail(id);
            if (redirect != null && lastUpdatedAt) {
                validateNotModified(redirect, lastUpdatedAt);
            }

            redirect.assign({ ...tranformedInput, target: tranformedInput.target.transformToBlockData() });
            await this.repository.persistAndFlush(redirect);
            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Redirect)
        async updateRedirectActiveness(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectUpdateActivenessInput }) input: RedirectUpdateActivenessInput,
        ): Promise<RedirectInterface> {
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
    }

    return RedirectsResolver;
}
