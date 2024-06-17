import { GridColDef, GridLinkOperator } from "@mui/x-data-grid";
import { GridFilterModel } from "@mui/x-data-grid/models/gridFilterModel";

import { muiGridFilterToGql } from "./muiGridFilterToGql";

const columns: GridColDef<{ tag: string }>[] = [{ field: "tag" }];

const mockedFilterModelAndOperator: GridFilterModel = {
    items: [
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 1,
            value: "de",
        },
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 2,
            value: "en",
        },
    ],
    linkOperator: GridLinkOperator.And,
};

const mockedFilterModelOrOperator: GridFilterModel = {
    items: [
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 1,
            value: "de",
        },
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 2,
            value: "en",
        },
    ],
    linkOperator: GridLinkOperator.Or,
};
const mockedFilterModelWithoutOperator: GridFilterModel = {
    items: [
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 1,
            value: "de",
        },
        {
            columnField: "tag",
            operatorValue: "contains",
            id: 2,
            value: "en",
        },
    ],
};

describe("muiGridFilterToGql", () => {
    it("should use correct and filter for specified and operator", () => {
        const result = muiGridFilterToGql(columns, mockedFilterModelAndOperator);

        expect(result).toEqual({ filter: { and: [{ tag: { contains: "de" } }, { tag: { contains: "en" } }] } });
    });

    it("should use correct or filter for specified or operator", () => {
        const result = muiGridFilterToGql(columns, mockedFilterModelOrOperator);

        expect(result).toEqual({ filter: { or: [{ tag: { contains: "de" } }, { tag: { contains: "en" } }] } });
    });

    it("should use correct and filter for no operator specified ", () => {
        const result = muiGridFilterToGql(columns, mockedFilterModelWithoutOperator);

        expect(result).toEqual({ filter: { and: [{ tag: { contains: "de" } }, { tag: { contains: "en" } }] } });
    });
});
