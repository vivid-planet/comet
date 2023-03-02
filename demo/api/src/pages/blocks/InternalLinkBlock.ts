import { internalLinkBlock } from "@comet/cms-api";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

export const InternalLinkBlock = internalLinkBlock({ pageTreeNodeEntityName: PageTreeNode.name });
