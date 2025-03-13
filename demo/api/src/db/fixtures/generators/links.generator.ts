import { InternalLinkBlock } from "@comet/cms-api";
import { type EntityRepository } from "@mikro-orm/postgresql";
import { LinkBlock } from "@src/common/blocks/link.block";
import { type PageTreeNodesFixtures } from "@src/db/fixtures/fixtures.command";
import { type Link } from "@src/documents/links/entities/link.entity";

export const generateLinks = async (linksRepository: EntityRepository<Link>, pageTreeNodes: PageTreeNodesFixtures): Promise<void> => {
    await linksRepository.getEntityManager().persistAndFlush(
        linksRepository.create({
            id: "46ce964c-f029-46f0-9961-ef436e2391f2",
            content: LinkBlock.blockInputFactory({
                attachedBlocks: [
                    {
                        type: "internal",
                        props: InternalLinkBlock.blockInputFactory({
                            targetPageId: pageTreeNodes.home?.id,
                        }),
                    },
                ],
                activeType: "internal",
            }).transformToBlockData(),
        }),
    );
};
