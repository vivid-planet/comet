import { v4 as uuid } from "uuid";
import { describe, expect, it } from "vitest";

import { mockColumnDataWithFiveValues as columnDataToInsert, mockTableData as initialState } from "../__mocks__/TableBlockData.mocks";
import { insertColumnDataAtIndex } from "../utils/column";

describe("insertColumnDataAtIndex", () => {
    it("should insert a column with the specified column id", () => {
        const newColumnId = uuid();
        const newState = insertColumnDataAtIndex(initialState, columnDataToInsert, 0, newColumnId);

        expect(newState.columns[0].id).toBe(newColumnId);
    });

    it("should insert the correct number of rows with the specified column id", () => {
        const newColumnId = uuid();
        const newState = insertColumnDataAtIndex(initialState, columnDataToInsert, 0, newColumnId);

        const allCellsWithNewColumnId = newState.rows.flatMap((row) => row.cellValues).filter((cellValue) => cellValue.columnId === newColumnId);
        expect(allCellsWithNewColumnId).toHaveLength(columnDataToInsert.cellValues.length);
    });

    it("should insert the correct number of rows with the automatically generated column id", () => {
        const newState = insertColumnDataAtIndex(initialState, columnDataToInsert, 0);

        const newColumnId = newState.columns[0].id;
        const newColumnValues = newState.rows.flatMap((row) => row.cellValues).filter((cellValue) => cellValue.columnId === newColumnId);
        expect(newColumnValues).toHaveLength(columnDataToInsert.cellValues.length);
    });

    it("should not have used an existing id for the column", () => {
        const newState = insertColumnDataAtIndex(initialState, columnDataToInsert, 0);

        const newColumnId = newState.columns[0].id;
        const columnsWithNewId = newState.columns.filter((column) => column.id === newColumnId);
        expect(columnsWithNewId).toHaveLength(1);
    });
});
