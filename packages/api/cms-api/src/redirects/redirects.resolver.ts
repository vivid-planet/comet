import { FilterQuery, FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { SubjectEntity } from "../common/decorators/subject-entity.decorator";
import { validateNotModified } from "../document/validateNotModified";
import { EmptyRedirectScope } from "./dto/empty-redirect-scope";
import { RedirectArgs } from "./dto/redirect.args";
import { RedirectBaseInput } from "./dto/redirect-base.input";
import { RedirectUpdateActivenessInput } from "./dto/redirect-update-activeness.input";
import { RedirectBase } from "./entities/redirect-base.entity";
import { RedirectInterface } from "./entities/redirect-entity.factory";
import { RedirectsService } from "./redirects.service";
import { RedirectScopeInterface } from "./types";

export function createRedirectsResolver({
    Redirect,
    RedirectInput,
    Scope: PassedScope,
}: {
    Redirect: Type<RedirectBase>;
    RedirectInput: Type<RedirectBaseInput>;
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

    @Resolver(() => Redirect)
    class RedirectsResolver {
        constructor(
            private readonly redirectService: RedirectsService,
            @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
        ) {}

        @Query(() => [Redirect])
        async redirects(
            @Args("scope", { type: () => Scope }) scope: RedirectScopeInterface,
            @Args() { query, type, active, sortColumnName, sortDirection }: RedirectArgs,
        ): Promise<RedirectInterface[]> {
            const where: FilterQuery<RedirectInterface> = this.redirectService.getFindCondition({ query, type, active });

            const scopeValue = nonEmptyScopeOrNothing(scope);
            if (scopeValue) {
                (where as any).scope = scopeValue;
            }

            const options: FindOptions<RedirectInterface> = {};
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }

            return this.repository.find(where, options);
        }

        @Query(() => Redirect)
        @SubjectEntity(Redirect)
        async redirect(@Args("id", { type: () => ID }) id: string): Promise<RedirectInterface | null> {
            const redirect = await this.repository.findOne(id);
            return redirect ?? null;
        }

        @Query(() => Boolean)
        async redirectSourceAvailable(
            @Args("scope", { type: () => Scope }) scope: RedirectScopeInterface,
            @Args("source", { type: () => String }) source: string,
        ): Promise<boolean> {
            const where: FilterQuery<RedirectInterface> = { source };
            const scopeValue = nonEmptyScopeOrNothing(scope);
            if (scopeValue) {
                where.scope = scopeValue;
            }
            const redirect = await this.repository.findOne(where);
            return redirect === null;
        }

        @Mutation(() => Redirect)
        async createRedirect(
            @Args("scope", { type: () => Scope }) scope: RedirectScopeInterface,
            @Args("input", { type: () => RedirectInput }) input: RedirectBaseInput,
        ): Promise<RedirectInterface> {
            const entity = this.repository.create({ ...input, target: input.target.transformToBlockData(), scope });
            await this.repository.persistAndFlush(entity);
            return this.repository.findOneOrFail(entity.id);
        }

        @Mutation(() => Redirect)
        @SubjectEntity(Redirect)
        async updateRedirect(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => RedirectInput }) input: RedirectBaseInput,
            @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        ): Promise<RedirectInterface> {
            const redirect = await this.repository.findOneOrFail(id);
            if (redirect != null && lastUpdatedAt) {
                validateNotModified(redirect, lastUpdatedAt);
            }

            redirect.assign({ ...input, target: input.target.transformToBlockData() });
            await this.repository.persistAndFlush(redirect);
            return this.repository.findOneOrFail(id);
        }

        @Mutation(() => Redirect)
        @SubjectEntity(Redirect)
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
        @SubjectEntity(Redirect)
        async deleteRedirect(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const entity = await this.repository.findOneOrFail(id);
            await this.repository.removeAndFlush(entity);
            return true;
        }
    }

    return RedirectsResolver;
}
