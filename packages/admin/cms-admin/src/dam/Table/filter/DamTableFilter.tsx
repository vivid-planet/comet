import { Field, FilterBar, FinalFormSearchTextField, IFilterApi, ISortInformation, TableFilterFinalForm } from "@comet/admin";
import * as React from "react";

import { DamFilter } from "../../DamTable";
import { DamSortPopover } from "./DamSortPopover";

interface DamTableFilterProps {
    filterApi: IFilterApi<DamFilter>;
}

export const DamTableFilter = ({ filterApi }: DamTableFilterProps): React.ReactElement => {
    return (
        <TableFilterFinalForm filterApi={filterApi}>
            <FilterBar>
                <Field name="searchText" component={FinalFormSearchTextField} />
                <Field<ISortInformation> name="sort">
                    {({ input }) => {
                        return <DamSortPopover onChoose={input.onChange} currentSort={input.value} />;
                    }}
                </Field>
            </FilterBar>
        </TableFilterFinalForm>
    );
};
