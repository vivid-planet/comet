import { getGridDateOperators, type GridColTypeDef, type GridFilterInputValueProps } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";
import { FormattedDate, FormattedMessage } from "react-intl";

const dateFormat = "yyyy-MM-dd";

const DatePickerFilter = ({ item, applyValue }: GridFilterInputValueProps) => {
    const dateValue = item.value ? parse(item.value, dateFormat, new Date()) : null;

    return (
        <DatePicker
            value={dateValue}
            label={<FormattedMessage id="dataGrid.filterOperator.date.label" defaultMessage="Value" />}
            onChange={(newValue: Date | null) => {
                const stringValue = newValue ? format(newValue, dateFormat) : "";
                applyValue({ ...item, value: stringValue });
            }}
            slotProps={{
                textField: {
                    variant: "standard",
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                        disableUnderline: true,
                    },
                },
            }}
        />
    );
};

export const dataGridDateColumn: GridColTypeDef = {
    type: "date",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" />,
    filterOperators: getGridDateOperators().map((operator) => ({
        ...operator,
        InputComponent: DatePickerFilter,
    })),
};

export const dataGridDateTimeColumn: GridColTypeDef = {
    type: "dateTime",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" timeStyle="short" />,
};
