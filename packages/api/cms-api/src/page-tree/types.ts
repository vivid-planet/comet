import { registerEnumType } from "@nestjs/graphql";

import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "./dto/page-tree-node.input";
import { PageTreeNodeBase } from "./entities/page-tree-node-base.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScopeInterface = Record<string, any>; //@TODO: move to general scope (other modules (redirect, dam) need this too)
export type PageTreeNodeCategory = string;
export type PageTreeNodeInterface = PageTreeNodeBase & { scope?: ScopeInterface };
export type PageTreeNodeCreateInputInterface = PageTreeNodeBaseCreateInput;
export type PageTreeNodeUpdateInputInterface = PageTreeNodeBaseUpdateInput;

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum PageTreeNodeVisibility {
    Published = "Published",
    Unpublished = "Unpublished",
    Archived = "Archived",
}
/* eslint-enable @typescript-eslint/naming-convention */

registerEnumType(PageTreeNodeVisibility, { name: "PageTreeNodeVisibility" });
