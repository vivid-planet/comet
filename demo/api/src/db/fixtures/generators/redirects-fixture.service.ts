import { RedirectGenerationType, RedirectInterface, REDIRECTS_LINK_BLOCK, RedirectsLinkBlock, RedirectSourceTypeValues } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RedirectsFixtureService {
    constructor(
        @Inject(REDIRECTS_LINK_BLOCK) private readonly redirectsLinkBlock: RedirectsLinkBlock,
        @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
    ) {}

    async generateRedirects(): Promise<void> {
        for (let i = 0; i < 7000; i++) {
            this.repository.create({
                generationType: RedirectGenerationType.manual,
                source: `/redirect-${i}`,
                target: this.redirectsLinkBlock
                    .blockInputFactory({
                        attachedBlocks: [
                            {
                                type: "internal",
                                props: {
                                    targetPageId: "aaa585d3-eca1-47c9-8852-9370817b49ac",
                                },
                            },
                        ],
                        activeType: "internal",
                    })
                    .transformToBlockData(),
                active: true,
                scope: {
                    domain: "main",
                    language: "en",
                },
                sourceType: RedirectSourceTypeValues.path,
            });
        }
        await this.repository.getEntityManager().flush();
    }
}
