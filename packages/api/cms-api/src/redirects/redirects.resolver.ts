import { FindOptions, wrap } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ArgsType, ID, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { CometValidationException } from "../common/errors/validation.exception";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { DynamicDtoValidationPipe } from "../common/validation/dynamic-dto-validation.pipe";
import { validateNotModified } from "../document/validateNotModified";
import { AffectedEntity } from "../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { EmptyRedirectScope } from "./dto/empty-redirect-scope";
import { PaginatedRedirectsArgsFactory } from "./dto/paginated-redirects-args.factory";
import { RedirectInputInterface } from "./dto/redirect-input.factory";
import { RedirectUpdateActivenessInput } from "./dto/redirect-update-activeness.input";
import { RedirectsArgsFactory } from "./dto/redirects-args.factory";
import { RedirectInterface } from "./entities/redirect-entity.factory";
import { RedirectsService } from "./redirects.service";
import { RedirectScopeInterface } from "./types";

export function createRedirectsResolver({
    Redirect,
    RedirectInput,
    Scope: PassedScope,
}: {
    Redirect: Type<RedirectInterface>;
    RedirectInput: Type<RedirectInputInterface>;
    Scope?: Type<RedirectScopeInterface>;
}): Type<unknown> {
    const Scope = PassedScope || EmptyRedirectScope;

    const hasNonEmptyScope = !!PassedScope;

    function nonEmptyScopeOrNothing(scope: RedirectScopeInterface): RedirectScopeInterface | undefined {
        // GraphQL sends the scope object with a null prototype ([Object: null prototype] { <key>: <value> }), but MikroORM uses the
        // object's hasOwnProperty method internally, resulting in a "object.hasOwnProperty is not a function" error. To fix this, we
        // create a "real" JavaScript object by using the spread operator.
        // See https://github.com/mikro-orm/mikro-orm/issues/2846 for more information.
        return hasNonEmptyScope ? { ...scope } : undefined;
    }

    @ObjectType()
    class PaginatedRedirects extends PaginatedResponseFactory.create(Redirect) {}

    @ArgsType()
    class RedirectsArgs extends RedirectsArgsFactory.create({ Scope }) {}

    @ArgsType()
    class PaginatedRedirectsArgs extends PaginatedRedirectsArgsFactory.create({ Scope }) {}

    @Resolver(() => Redirect)
    @RequiredPermission(["pageTree"], { skipScopeCheck: !hasNonEmptyScope })
    class RedirectsResolver {
        constructor(
            private readonly redirectService: RedirectsService,
            @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
        ) {}

        @Query(() => [Redirect], { deprecationReason: "Use paginatedRedirects instead. Will be removed in the next version." })
        async redirects(@Args() { scope, query, type, active, sortColumnName, sortDirection }: RedirectsArgs): Promise<RedirectInterface[]> {
            const where = this.redirectService.getFindCondition({ query, type, active });
            if (hasNonEmptyScope) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (where as any).scope = scope;
            }

            const options: FindOptions<RedirectInterface> = {};
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }

            return this.repository.find(where, options);
        }

        @Query(() => PaginatedRedirects)
        async paginatedRedirects(@Args() { scope, search, filter, sort, offset, limit }: PaginatedRedirectsArgs): Promise<PaginatedRedirects> {
            const where = this.redirectService.getFindConditionPaginatedRedirects({ search, filter });
            if (hasNonEmptyScope) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (where as any).scope = scope;
            }

            const options: FindOptions<RedirectInterface> = { offset, limit };

            if (sort) {
                options.orderBy = sort.map((sortItem) => {
                    return {
                        [sortItem.field]: sortItem.direction,
                    };
                });
            }

            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new PaginatedRedirects(entities, totalCount);
        }

        @Query(() => Redirect)
        @AffectedEntity(Redirect)
        async redirect(@Args("id", { type: () => ID }) id: string): Promise<RedirectInterface | null> {
            const redirect = await this.repository.findOne(id);
            return redirect ?? null;
        }

        @Query(() => Boolean)
        async redirectSourceAvailable(
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
            @Args("source", { type: () => String }) source: string,
        ): Promise<boolean> {
            return this.redirectService.isRedirectSourceAvailable(source, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => Redirect)
        async createRedirect(
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }, new DynamicDtoValidationPipe(Scope))
            scope: typeof Scope,
            @Args("input", { type: () => RedirectInput }, new DynamicDtoValidationPipe(RedirectInput)) input: RedirectInputInterface,
        ): Promise<RedirectInterface> {
            if (!(await this.redirectService.isRedirectSourceAvailable(input.source, nonEmptyScopeOrNothing(scope)))) {
                throw new CometValidationException("Validation failed");
            }

            const entity = this.repository.create({
                scope: nonEmptyScopeOrNothing(scope),
                ...input,
                target: input.target.transformToBlockData(),
            });
            await this.repository.persistAndFlush(entity);
            return this.repository.findOneOrFail(entity.id);
        }

        @Mutation(() => Redirect)
        @AffectedEntity(Redirect)
        async updateRedirect(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectInput }, new DynamicDtoValidationPipe(RedirectInput)) input: RedirectInputInterface,
            @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        ): Promise<RedirectInterface> {
            const redirect = await this.repository.findOneOrFail(id);
            if (redirect != null && lastUpdatedAt) {
                validateNotModified(redirect, lastUpdatedAt);
            }

            if (!(await this.redirectService.isRedirectSourceAvailable(input.source, redirect.scope, { excludedId: redirect.id }))) {
                throw new CometValidationException("Validation failed");
            }

            wrap(redirect).assign({ ...input, target: input.target.transformToBlockData() });
            await this.repository.persistAndFlush(redirect);
            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Redirect)
        @AffectedEntity(Redirect)
        async updateRedirectActiveness(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectUpdateActivenessInput }) input: RedirectUpdateActivenessInput,
        ): Promise<RedirectInterface> {
            const redirect = await this.repository.findOneOrFail(id);

            wrap(redirect).assign({ active: input.active });
            await this.repository.persistAndFlush(redirect);

            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Boolean)
        @AffectedEntity(Redirect)
        async deleteRedirect(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const entity = await this.repository.findOneOrFail(id);
            await this.repository.removeAndFlush(entity);
            return true;
        }
    }

    return RedirectsResolver;
}
