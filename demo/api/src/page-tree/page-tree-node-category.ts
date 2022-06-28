import { registerEnumType } from "@nestjs/graphql";

export enum PageTreeNodeCategory {
    MainNavigation = "main-navigation",
}

registerEnumType(PageTreeNodeCategory, { name: "PageTreeNodeCategory" });
