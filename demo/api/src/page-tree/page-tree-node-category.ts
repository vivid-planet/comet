import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum PageTreeNodeCategory {
    MainNavigation = "MainNavigation",
    TopMenu = "TopMenu",
}
/* eslint-enable @typescript-eslint/naming-convention */

registerEnumType(PageTreeNodeCategory, { name: "PageTreeNodeCategory" });
