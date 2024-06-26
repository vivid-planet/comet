import { FinalFormSubmitEvent } from "@comet/admin";
import { ExtendedGridFilterOperator } from "@comet/admin/lib/dataGrid/GridColDef";
import { DateRange, DateRangeField } from "@comet/admin-date-time";
import { Box } from "@mui/material";
import { GridFilterInputValueProps, GridFilterItem } from "@mui/x-data-grid-pro";
import { FormApi } from "final-form";
import * as React from "react";
import { Form } from "react-final-form";

type FormValues = {
    dateRange: DateRange;
};

// Based on: https://mui.com/x/react-data-grid/filtering/customization/#multiple-values-operator
function DateBetweenFilter(props: GridFilterInputValueProps) {
    const [filterValueState, setFilterValueState] = React.useState<[string, string]>(["", ""]);

    const handleSubmit = async (state: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        setFilterValueState([state.dateRange.start, state.dateRange.end]);
        console.log(filterValueState);
        const item: GridFilterItem = {
            value: { greaterThan: state.dateRange.start, lowerThan: state.dateRange.end },
            operatorValue: props.item.operatorValue,
            columnField: props.item.columnField,
        };
        props.applyValue(item);
    };

    //TODO increase filter panel size
    return (
        <Box
            sx={{
                display: "inline-flex",
                flexDirection: "row",
                height: 48,
            }}
        >
            {/*<FinalForm<FormValues> apiRef={formApiRef} onSubmit={handleSubmit} mode="add">*/}
            <Form<FormValues> onSubmit={() => handleSubmit}>
                {({ values }) => (
                    <form>
                        <>
                            <DateRangeField
                                name="dateRange"
                                variant="horizontal"
                                sx={{ mr: 2 }}
                                helperText={`Stringified value: ${JSON.stringify(values.dateRange)}`} //TODO Remove when done
                            />
                        </>
                    </form>
                )}
            </Form>
        </Box>
    );
}

export const dateBetweenOperator: ExtendedGridFilterOperator = {
    label: "between",
    value: "between",
    //required but irrelevant, as filter runs remotely via gql.
    getApplyFilterFn: (filterItem) => {
        return (filterItem) => {
            return true;
        };
    },
    convertFilterToGQLFilter: () => {
        return ["greaterThan", "lowerThan"]; //TODO correct filter
        // const filter : DateFilter = {greaterThan: minDate, lowerThan: maxDate};
        // return filter; //filter object like api
    },
    InputComponent: DateBetweenFilter,
};
