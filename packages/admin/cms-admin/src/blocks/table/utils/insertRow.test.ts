import { type TableBlockData } from "../../../blocks.generated";
import { insertRow } from "./insertRow";
import { exampleTableBlockData, headerRow } from "./testData/fourColumnsTestData";

describe("insertRow", () => {
    it("should insert an new row above the first (header) row", () => {
        const initialData: TableBlockData = JSON.parse(JSON.stringify(exampleTableBlockData));
        const allExistingRowIds = initialData.rows.map((row) => row.id);

        const updatedData = insertRow(initialData, headerRow.id, "above");
        const firstRowInUpdatedData = updatedData.rows[0];

        expect(allExistingRowIds.includes(firstRowInUpdatedData.id)).toBe(false);
        expect(updatedData.rows.length).toEqual(initialData.rows.length + 1);

        expect(firstRowInUpdatedData.cellValues.length).toEqual(exampleTableBlockData.columns.length);

        expect(firstRowInUpdatedData.cellValues[0].columnId).toEqual(exampleTableBlockData.columns[0].id);
        expect(firstRowInUpdatedData.cellValues[0].value).toEqual("");
        expect(firstRowInUpdatedData.cellValues[1].columnId).toEqual(exampleTableBlockData.columns[1].id);
        expect(firstRowInUpdatedData.cellValues[1].value).toEqual("");
        expect(firstRowInUpdatedData.cellValues[2].columnId).toEqual(exampleTableBlockData.columns[2].id);
        expect(firstRowInUpdatedData.cellValues[2].value).toEqual("");
        expect(firstRowInUpdatedData.cellValues[3].columnId).toEqual(exampleTableBlockData.columns[3].id);
        expect(firstRowInUpdatedData.cellValues[3].value).toEqual("");

        expect(firstRowInUpdatedData.id).not.toEqual(headerRow.id);

        expect(initialData.rows[0].id).toEqual(updatedData.rows[1].id);
        expect(initialData.rows[3].id).toEqual(updatedData.rows[4].id);
        expect(initialData.rows[0].cellValues).toEqual(updatedData.rows[1].cellValues);
    });
});
