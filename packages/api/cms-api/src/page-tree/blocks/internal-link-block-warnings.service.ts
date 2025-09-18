import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { BlockWarning, BlockWarningsServiceInterface } from "../../blocks/block.js";
import { PageTreeNodeBase } from "../entities/page-tree-node-base.entity.js";
import type { InternalLinkBlockData } from "./internal-link.block.js";

@Injectable()
export class InternalLinkBlockWarningsService implements BlockWarningsServiceInterface<InternalLinkBlockData> {
    constructor(@InjectRepository("PageTreeNode") private readonly pageTreeRepository: EntityRepository<PageTreeNodeBase>) {}

    async warnings(block: InternalLinkBlockData): Promise<BlockWarning[]> {
        const warnings: BlockWarning[] = [];

        if (block.targetPageId) {
            const linkedPageTreeNode = await this.pageTreeRepository.findOne({ id: block.targetPageId });
            if (!linkedPageTreeNode) {
                warnings.push({
                    message: "invalidTarget",
                    severity: "high",
                });
            }
        } else {
            warnings.push({
                message: "missingTarget",
                severity: "high",
            });
        }

        return warnings;
    }
}
