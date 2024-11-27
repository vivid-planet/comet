import { gql, useQuery } from "@apollo/client";
import { InputBase } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { GridFilterInputValueProps, GridFilterOperator } from "@mui/x-data-grid-pro";
import * as React from "react";
import { useIntl } from "react-intl";
import { useDebounce } from "use-debounce";

import { GQLManufacturersFilterQuery, GQLManufacturersFilterQueryVariables } from "./ManufacturerFilter.generated";

const manufacturersQuery = gql`
    query ManufacturersFilter($offset: Int!, $limit: Int!, $search: String) {
        manufacturers(offset: $offset, limit: $limit, search: $search) {
            nodes {
                id
                name
            }
            totalCount
        }
    }
`;

// Source: https://mui.com/x/react-data-grid/filtering/customization/#multiple-values-operator
function ManufacturerFilter({ item, applyValue }: GridFilterInputValueProps) {
    const intl = useIntl();
    const [search, setSearch] = React.useState<string | undefined>(undefined);
    const [debouncedSearch] = useDebounce(search, 500);

    const { data } = useQuery<GQLManufacturersFilterQuery, GQLManufacturersFilterQueryVariables>(manufacturersQuery, {
        variables: {
            offset: 0,
            limit: 10,
            search: debouncedSearch,
        },
    });

    // source https://mui.com/material-ui/react-autocomplete/
    return (
        <Autocomplete
            size="small"
            options={data?.manufacturers.nodes ?? []}
            autoHighlight
            value={item.value ? item.value : null}
            filterOptions={(x) => x} // disable local filtering
            isOptionEqualToValue={(option, value) => {
                // does only highlight the selected value in options-list but does not trigger getOptionLabel-Call
                return option.id == value;
            }}
            getOptionLabel={(option) => {
                // option.name is not set if loaded from filters-model, small delay replacing id with name because of loading
                return option.name ?? data?.manufacturers.nodes.find((item) => item.id === option)?.name ?? option;
            }}
            onChange={(event, value, reason) => {
                // value can't be "{ id: value.id, name: value.name }" because value is sent to api
                applyValue({ id: item.id, operatorValue: "equals", value: value ? value.id : undefined, columnField: "manufacturer" });
            }}
            renderInput={(params) => (
                <InputBase
                    {...params}
                    {...params.InputProps}
                    autoComplete="off"
                    placeholder={intl.formatMessage({ id: "manufacturer-filter.placeholder", defaultMessage: "Choose a manufacturer" })}
                    value={search ? search : null}
                    onChange={(event) => {
                        setSearch(event.target.value);
                    }}
                />
            )}
        />
    );
}

export const ManufacturerFilterOperator: GridFilterOperator = {
    value: "equals",
    getApplyFilterFn: (filterItem) => {
        throw new Error("not implemented, we filter server side");
    },
    InputComponent: ManufacturerFilter,
};
