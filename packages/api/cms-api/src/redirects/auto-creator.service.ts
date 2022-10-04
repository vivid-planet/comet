import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeInterface } from "../page-tree/types";
import { RedirectInterface } from "./entities/redirect-entity.factory";
import { RedirectGenerationType, RedirectSourceTypeValues } from "./redirects.enum";
import { REDIRECTS_LINK_BLOCK, RedirectsLinkBlock } from "./redirects.module";

@Injectable()
export class AutoCreatorService {
    constructor(
        @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
        @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
        @Inject(REDIRECTS_LINK_BLOCK) private readonly linkBlock: RedirectsLinkBlock,
    ) {}

    async createAutomaticRedirects(node: PageTreeNodeInterface): Promise<void> {
        const readApi = this.pageTreeService.createReadApi({ visibility: "all" });
        const path = await readApi.nodePath(node);

        await this.repository.persistAndFlush(
            this.repository.create({
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
}
