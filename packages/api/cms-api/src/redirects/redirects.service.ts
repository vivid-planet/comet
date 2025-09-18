import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, FilterQuery } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "../common/filter/mikro-orm.js";
import { PageTreeService } from "../page-tree/page-tree.service.js";
import type { PageTreeNodeInterface } from "../page-tree/types.js";
import { RedirectFilter } from "./dto/redirects.filter.js";
import type { RedirectInterface } from "./entities/redirect-entity.factory.js";
import { REDIRECTS_LINK_BLOCK } from "./redirects.constants.js";
import { RedirectGenerationType, RedirectSourceTypeValues } from "./redirects.enum.js";
import { RedirectsLinkBlock } from "./redirects.module.js";
import type { RedirectScopeInterface } from "./types.js";

@Injectable()
export class RedirectsService {
    constructor(
        @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
        @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
        @Inject(REDIRECTS_LINK_BLOCK) private readonly linkBlock: RedirectsLinkBlock,
        private readonly entityManager: EntityManager,
    ) {}

    getFindCondition({
        query,
        active,
        type,
    }: {
        query: string | undefined;
        active?: boolean;
        type?: RedirectGenerationType;
    }): FilterQuery<RedirectInterface> {
        let filterConditions: FilterQuery<RedirectInterface> = {};

        if (type) {
            filterConditions = {
                ...filterConditions,
                generationType: type,
            };
        }

        if (active != null) {
            filterConditions = {
                ...filterConditions,
                active,
            };
        }

        if (query) {
            return {
                $or: [{ source: { $ilike: `%${query}%` } }],
                $and: [...Object.entries(filterConditions).map(([key, value]) => ({ [key]: value }))],
            };
        } else {
            return filterConditions;
        }
    }

    getFindConditionPaginatedRedirects(options: { search?: string; filter?: RedirectFilter }): FilterQuery<RedirectInterface> {
        const andFilters = [];

        if (options.search) {
            andFilters.push(searchToMikroOrmQuery(options.search, ["source"]));
        }

        if (options.filter) {
            andFilters.push(filtersToMikroOrmQuery(options.filter));
        }

        return andFilters.length > 0 ? { $and: andFilters } : {};
    }

    async createAutomaticRedirects(node: PageTreeNodeInterface): Promise<void> {
        const readApi = this.pageTreeService.createReadApi({ visibility: "all" });
        const path = await readApi.nodePath(node);
        await this.entityManager.persistAndFlush(
            this.repository.create({
                scope: node.scope,
                sourceType: RedirectSourceTypeValues.path,
                source: path,
                target: this.linkBlock
                    .blockInputFactory({
                        attachedBlocks: [
                            {
                                type: "internal",
                                props: {
                                    targetPageId: node.id,
                                },
                            },
                        ],
                        activeType: "internal",
                    })
                    .transformToBlockData(),
                generationType: RedirectGenerationType.automatic,
            }),
        );

        const childNodes = await readApi.getChildNodes(node);

        for (const childNode of childNodes) {
            await this.createAutomaticRedirects(childNode);
        }
    }

    async isRedirectSourceAvailable(source: string, scope: RedirectScopeInterface | undefined, options?: { excludedId?: string }): Promise<boolean> {
        const where: FilterQuery<RedirectInterface> = { source, id: { $ne: options?.excludedId } };
        if (scope !== undefined) {
            where.scope = scope;
        }
        const redirect = await this.repository.findOne(where);
        return redirect === null;
    }
}
