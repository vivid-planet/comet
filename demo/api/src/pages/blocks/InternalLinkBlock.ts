import { createInternalLinkBlock } from "@comet/cms-api";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

export const InternalLinkBlock = createInternalLinkBlock({ pageTreeNodeEntityName: PageTreeNode.name });
