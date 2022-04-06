import { FilterQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeInterface } from "../page-tree/types";
import { Redirect } from "./entities/redirect.entity";
import { RedirectGenerationType, RedirectSourceTypeValues, RedirectTargetTypeValues } from "./redirects.enum";

@Injectable()
export class RedirectsService {
    constructor(
        @InjectRepository(Redirect) private readonly repository: EntityRepository<Redirect>,
        @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
    ) {}

    getFindCondition({ query, active, type }: { query: string | undefined; active?: boolean; type?: RedirectGenerationType }): FilterQuery<Redirect> {
        let filterConditions: FilterQuery<Redirect> = {};

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
                $or: [{ source: { $ilike: `%${query}%` } }, { targetUrl: { $ilike: `%${query}%` } }],
                $and: [...Object.entries(filterConditions).map(([key, value]) => ({ [key]: value }))],
            };
        } else {
            return filterConditions;
        }
    }

    async createAutomaticRedirects(node: PageTreeNodeInterface): Promise<void> {
        const readApi = this.pageTreeService.createReadApi({ visibility: "all" });
        const path = await readApi.nodePath(node);

        await this.repository.persistAndFlush(
            this.repository.create({
                sourceType: RedirectSourceTypeValues.path,
                source: path,
                targetType: RedirectTargetTypeValues.intern,
                targetPageId: node.id,
                generationType: RedirectGenerationType.automatic,
            }),
        );

        const childNodes = await readApi.getChildNodes(node);

        for (const childNode of childNodes) {
            await this.createAutomaticRedirects(childNode);
        }
    }
}
