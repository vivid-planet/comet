import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(SortDirection, {
    name: "SortDirection",
});
