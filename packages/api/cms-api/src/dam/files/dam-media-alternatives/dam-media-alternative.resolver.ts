import { FindOptions, Reference } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";

import { CometValidationException } from "../../../common/errors/validation.exception";
import { gqlArgsToMikroOrmQuery } from "../../../common/filter/mikro-orm";
import { extractGraphqlFields } from "../../../common/graphql/extract-graphql-fields";
import { AffectedEntity } from "../../../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../../../user-permissions/decorators/required-permission.decorator";
import { DamScopeInterface } from "../../types";
import { FILE_ENTITY, FileInterface } from "../entities/file.entity";
import { DamMediaAlternativeInput, DamMediaAlternativeUpdateInput } from "./dto/dam-media-alternative.input";
import { DamMediaAlternativesArgs } from "./dto/dam-media-alternatives.args";
import { PaginatedDamMediaAlternatives } from "./dto/paginated-dam-media-alternatives";
import { DamMediaAlternative } from "./entities/dam-media-alternative.entity";

export function createDamMediaAlternativeResolver({
    File,
    Scope: PassedScope,
}: {
    File: Type<FileInterface>;
    Scope?: Type<DamScopeInterface>;
}): Type<unknown> {
    // const hasNonEmptyScope = PassedScope != null;

    @Resolver(() => DamMediaAlternative)
    // @RequiredPermission(["dam"], { skipScopeCheck: !hasNonEmptyScope })
    @RequiredPermission(["dam"], { skipScopeCheck: true })
    class DamMediaAlternativeResolver {
        constructor(
            private readonly entityManager: EntityManager,
            @InjectRepository(DamMediaAlternative) private readonly repository: EntityRepository<DamMediaAlternative>,
            @InjectRepository(FILE_ENTITY) private readonly damFileRepository: EntityRepository<FileInterface>,
        ) {}

        @Query(() => DamMediaAlternative)
        @AffectedEntity(DamMediaAlternative)
        async damMediaAlternative(@Args("id", { type: () => ID }) id: string): Promise<DamMediaAlternative> {
            const damMediaAlternative = await this.repository.findOneOrFail(id);
            return damMediaAlternative;
        }

        @Query(() => PaginatedDamMediaAlternatives)
        async damMediaAlternatives(
            @Args() { search, filter, sort, offset, limit, for: forId, alternative: alternativeId, type }: DamMediaAlternativesArgs,
            @Info() info: GraphQLResolveInfo,
        ): Promise<PaginatedDamMediaAlternatives> {
            if ((!forId && !alternativeId) || (forId && alternativeId)) {
                throw new CometValidationException("Exactly one of 'for' or 'alternative' parameters must be provided");
            }

            const where = gqlArgsToMikroOrmQuery({ search, filter }, this.repository);

            if (forId) {
                where.for = forId;
            } else if (alternativeId) {
                where.alternative = alternativeId;
            }

            if (type) {
                where.type = type;
            }

            const fields = extractGraphqlFields(info, { root: "nodes" });
            const populate: string[] = [];
            if (fields.includes("for")) {
                populate.push("for");
            }
            if (fields.includes("alternative")) {
                populate.push("alternative");
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options: FindOptions<DamMediaAlternative, any> = { offset, limit, populate };

            if (sort) {
                options.orderBy = sort.map((sortItem) => {
                    if (sortItem.field === "alternative") {
                        return { alternative: { name: sortItem.direction } };
                    } else if (sortItem.field === "for") {
                        return { for: { name: sortItem.direction } };
                    }
                    return {
                        [sortItem.field]: sortItem.direction,
                    };
                });
            }

            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new PaginatedDamMediaAlternatives(entities, totalCount);
        }

        @Mutation(() => DamMediaAlternative)
        async createDamMediaAlternative(
            @Args("input", { type: () => DamMediaAlternativeInput }) input: DamMediaAlternativeInput,
        ): Promise<DamMediaAlternative> {
            const { for: forInput, alternative: alternativeInput, ...assignInput } = input;
            const damMediaAlternative = this.repository.create({
                ...assignInput,

                for: Reference.create(await this.damFileRepository.findOneOrFail(forInput)),
                alternative: Reference.create(await this.damFileRepository.findOneOrFail(alternativeInput)),
            });

            await this.entityManager.flush();

            return damMediaAlternative;
        }

        @Mutation(() => DamMediaAlternative)
        @AffectedEntity(DamMediaAlternative)
        async updateDamMediaAlternative(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => DamMediaAlternativeUpdateInput }) input: DamMediaAlternativeUpdateInput,
        ): Promise<DamMediaAlternative> {
            const damMediaAlternative = await this.repository.findOneOrFail(id);

            const { for: forInput, alternative: alternativeInput, ...assignInput } = input;
            damMediaAlternative.assign({
                ...assignInput,
            });

            if (forInput !== undefined) {
                damMediaAlternative.for = Reference.create(await this.damFileRepository.findOneOrFail(forInput));
            }
            if (alternativeInput !== undefined) {
                damMediaAlternative.alternative = Reference.create(await this.damFileRepository.findOneOrFail(alternativeInput));
            }

            await this.entityManager.flush();

            return damMediaAlternative;
        }

        @Mutation(() => Boolean)
        @AffectedEntity(DamMediaAlternative)
        async deleteDamMediaAlternative(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const damMediaAlternative = await this.repository.findOneOrFail(id);
            this.entityManager.remove(damMediaAlternative);
            await this.entityManager.flush();
            return true;
        }

        @ResolveField(() => File)
        async for(@Parent() damMediaAlternative: DamMediaAlternative): Promise<FileInterface> {
            return damMediaAlternative.for.load();
        }

        @ResolveField(() => File)
        async alternative(@Parent() damMediaAlternative: DamMediaAlternative): Promise<FileInterface> {
            return damMediaAlternative.alternative.load();
        }
    }

    return DamMediaAlternativeResolver;
}
