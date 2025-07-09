import {
    Field,
    FilterBar,
    FilterBarPopoverFilter,
    FinalFormSearchTextField,
    IFilterApi,
    ISortInformation,
    SwitchField,
    TableFilterFinalForm,
} from "@comet/admin";
import { FormattedMessage, useIntl } from "react-intl";

import { DamFilter } from "../../DamTable";
import { DamSortPopover } from "./DamSortPopover";

interface DamTableFilterProps {
    hideArchiveFilter?: boolean;
    filterApi: IFilterApi<DamFilter>;
}

export const DamTableFilter = ({ filterApi, hideArchiveFilter }: DamTableFilterProps) => {
    const intl = useIntl();

    return (
        <TableFilterFinalForm filterApi={filterApi}>
            <FilterBar>
                <Field
                    name="searchText"
                    component={FinalFormSearchTextField}
                    clearable
                    disableContentTranslation
                    fieldContainerProps={{ fieldMargin: "never" }}
                />
                {!hideArchiveFilter && (
                    <FilterBarPopoverFilter
                        label={intl.formatMessage({ id: "comet.pages.dam.archived", defaultMessage: "Archived" })}
                        sx={{ marginRight: 2, marginLeft: 2 }}
                    >
                        <SwitchField
                            name="archived"
                            label={<FormattedMessage id="comet.pages.dam.showArchivedAssets" defaultMessage="Show archived assets" />}
                        />
                    </FilterBarPopoverFilter>
                )}
                <Field<ISortInformation> name="sort">
                    {({ input }) => {
                        return <DamSortPopover onChoose={input.onChange} currentSort={input.value} />;
                    }}
                </Field>
            </FilterBar>
        </TableFilterFinalForm>
    );
};
