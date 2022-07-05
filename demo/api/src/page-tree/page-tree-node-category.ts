import { registerEnumType } from "@nestjs/graphql";

export enum PageTreeNodeCategory {
    MainNavigation = "MainNavigation",
    TopMenu = "TopMenu",
}

registerEnumType(PageTreeNodeCategory, { name: "PageTreeNodeCategory" });
