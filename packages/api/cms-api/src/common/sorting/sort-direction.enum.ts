import { registerEnumType } from "@nestjs/graphql";

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
registerEnumType(SortDirection, {
    name: "SortDirection",
});
