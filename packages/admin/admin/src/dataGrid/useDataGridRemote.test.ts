import { GridSortDirection } from "@mui/x-data-grid";
import { GridFilterModel } from "@mui/x-data-grid/models/gridFilterModel";
import { renderHook } from "@testing-library/react-hooks";
import queryString from "query-string";

const useHistory = jest.fn();
const useLocation = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useHistory,
    useLocation,
}));

import { useDataGridRemote } from "./useDataGridRemote";

const mockedReplace = jest.fn();
const mockedSortField = "description";
const mockedSort = "asc";
const mockedFilterModel: GridFilterModel = {
    items: [{ columnField: "price", id: 1, operatorValue: ">", value: "30" }],
    quickFilterValues: ["a"],
};
const mockedPage = 17;
const mockedPageSize = 42;

describe("useDataGridRemote", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        useLocation.mockReturnValue({
            search: "",
        });

        useHistory.mockReturnValue({
            replace: mockedReplace,
        });
    });

    it("reads sort param from URL and returns correct value", () => {
        useLocation.mockReturnValue({
            search: queryString.stringify({ sort: `${mockedSortField}:${mockedSort}` }),
        });

        const { result } = renderHook(() => useDataGridRemote());

        expect(result.current.sortModel).toEqual([{ field: mockedSortField, sort: mockedSort }]);
    });

    it("reads filter param from URL and returns correct value", () => {
        useLocation.mockReturnValue({
            search: queryString.stringify({ filter: JSON.stringify(mockedFilterModel) }),
        });

        const { result } = renderHook(() => useDataGridRemote());

        expect(result.current.filterModel).toEqual(mockedFilterModel);
    });

    it("reads page param from URL and returns correct value", () => {
        useLocation.mockReturnValue({
            search: queryString.stringify({ page: mockedPage }),
        });

        const { result } = renderHook(() => useDataGridRemote());

        expect(result.current.page).toBe(mockedPage);
    });

    it("reads pageSize param from URL and returns correct value", () => {
        useLocation.mockReturnValue({
            search: queryString.stringify({ pageSize: mockedPageSize }),
        });

        const { result } = renderHook(() => useDataGridRemote());

        expect(result.current.pageSize).toBe(mockedPageSize);
    });

    it("writes sort param to URL", () => {
        const { result } = renderHook(() => useDataGridRemote());

        result.current.onSortModelChange?.([{ field: mockedSortField, sort: mockedSort }], {});

        expect(mockedReplace).toHaveBeenCalledWith({ search: queryString.stringify({ sort: `${mockedSortField}:${mockedSort}` }) });
    });

    it("writes filter param to URL", () => {
        const { result } = renderHook(() => useDataGridRemote());

        result.current.onFilterModelChange?.(mockedFilterModel, {});

        expect(mockedReplace).toHaveBeenCalledWith({ search: queryString.stringify({ filter: JSON.stringify(mockedFilterModel) }) });
    });

    it("writes page param to URL", () => {
        const { result } = renderHook(() => useDataGridRemote());

        result.current.onPageChange?.(mockedPage, {});

        expect(mockedReplace).toHaveBeenCalledWith({ search: queryString.stringify({ page: mockedPage }) });
    });

    it("writes pageSize param to URL", () => {
        const { result } = renderHook(() => useDataGridRemote());

        result.current.onPageSizeChange?.(mockedPageSize, {});

        expect(mockedReplace).toHaveBeenCalledWith({ search: queryString.stringify({ pageSize: mockedPageSize }) });
    });

    it("uses queryParamsPrefix when reading params from URL", () => {
        const prefix = "mocked";
        useLocation.mockReturnValue({
            search: queryString.stringify({
                [`${prefix}sort`]: `${mockedSortField}:${mockedSort}`,
                [`${prefix}filter`]: JSON.stringify(mockedFilterModel),
                [`${prefix}page`]: mockedPage,
                [`${prefix}pageSize`]: mockedPageSize,
            }),
        });

        const { result } = renderHook(() => useDataGridRemote({ queryParamsPrefix: prefix }));

        expect(result.current.sortModel).toEqual([{ field: mockedSortField, sort: mockedSort }]);
        expect(result.current.filterModel).toEqual(mockedFilterModel);
        expect(result.current.page).toBe(mockedPage);
        expect(result.current.pageSize).toBe(mockedPageSize);
    });

    it("adds queryParamsPrefix when writing to URL if queryParamsPrefix is set", () => {
        const prefix = "mocked";

        const { result } = renderHook(() => useDataGridRemote({ queryParamsPrefix: prefix }));

        result.current.onSortModelChange?.([{ field: mockedSortField, sort: mockedSort }], {});
        expect(mockedReplace.mock.calls[0]?.[0]?.search).toContain(`${prefix}sort`);

        result.current.onFilterModelChange?.(mockedFilterModel, {});
        expect(mockedReplace.mock.calls[1]?.[0]?.search).toContain(`${prefix}filter`);

        result.current.onPageChange?.(mockedPage, {});
        expect(mockedReplace.mock.calls[2]?.[0]?.search).toContain(`${prefix}page`);

        result.current.onPageSizeChange?.(mockedPageSize, {});
        expect(mockedReplace.mock.calls[3]?.[0]?.search).toContain(`${prefix}pageSize`);

        expect(mockedReplace).toHaveBeenCalledTimes(4);
    });

    it("uses initial default pageSize if no pageSize is set in the URL", () => {
        const mockedInitialPageSize = 37;

        const { result } = renderHook(() => useDataGridRemote({ pageSize: mockedInitialPageSize }));

        expect(result.current.pageSize).toBe(mockedInitialPageSize);
    });

    it("doesn't use initial default pageSize if a pageSize is set in the URL", () => {
        const mockedInitialPageSize = 37;
        const mockedUrlPageSize = mockedPageSize;
        useLocation.mockReturnValue({
            search: queryString.stringify({ pageSize: mockedPageSize }),
        });

        const { result } = renderHook(() => useDataGridRemote({ pageSize: mockedInitialPageSize }));

        expect(result.current.pageSize).toBe(mockedUrlPageSize);
    });

    it("uses initial sort if no sort is set in the URL", () => {
        const mockedInitialSort: Array<{ field: string; sort: GridSortDirection }> = [{ field: "initial", sort: "desc" }];

        const { result } = renderHook(() => useDataGridRemote({ initialSort: mockedInitialSort }));

        expect(result.current.sortModel).toBe(mockedInitialSort);
    });

    it("doesn't use initial default sort if sort is set in the URL", () => {
        const mockedInitialSortModel: Array<{ field: string; sort: GridSortDirection }> = [{ field: "initial", sort: "desc" }];
        const mockedUrlField = mockedSortField;
        const mockedUrlSort = mockedSort;
        const mockedUrlSortModel = [{ field: mockedUrlField, sort: mockedUrlSort }];
        useLocation.mockReturnValue({
            search: queryString.stringify({ sort: `${mockedUrlField}:${mockedUrlSort}` }),
        });

        const { result } = renderHook(() => useDataGridRemote({ initialSort: mockedInitialSortModel }));

        expect(result.current.sortModel).toEqual(mockedUrlSortModel);
    });

    it("should set empty initial filter if not provided", () => {
        const { result } = renderHook(() => useDataGridRemote());

        expect(result.current.filterModel).toEqual({ items: [] });
    });

    it("uses initial filter if no filter is set in the URL", () => {
        const { result } = renderHook(() => useDataGridRemote({ initialFilter: mockedFilterModel }));

        expect(result.current.filterModel).toBe(mockedFilterModel);
    });

    it("doesn't use initial default filter if filter is set in the URL", () => {
        const mockedUrlFilterModel = { items: [{ columnField: "description", id: 1, operatorValue: "equal", value: "Test" }] };
        useLocation.mockReturnValue({
            search: queryString.stringify({ filter: '{"items":[{"columnField":"description","id":1,"operatorValue":"equal","value":"Test"}]}' }),
        });

        const { result } = renderHook(() => useDataGridRemote({ initialFilter: mockedFilterModel }));

        expect(result.current.filterModel).toEqual(mockedUrlFilterModel);
    });
});
