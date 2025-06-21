import { registerEnumType } from "@nestjs/graphql";

export enum PageTreeNodeCategory {
    mainNavigation = "mainNavigation",
    topMenu = "topMenu",
}

registerEnumType(PageTreeNodeCategory, { name: "PageTreeNodeCategory" });
