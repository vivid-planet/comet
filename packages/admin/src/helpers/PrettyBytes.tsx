import * as React from "react";
import { FormattedNumber } from "react-intl";

type AvailableUnits = "byte" | "kilobyte" | "megabyte" | "gigabyte" | "terabyte" | "petabyte";
const availableUnits: AvailableUnits[] = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];

interface PrettyBytesProps {
    value: number;
    maximumFractionDigits?: number;
    unit?: AvailableUnits;
}

export const PrettyBytes = ({
    value: bytes,
    maximumFractionDigits: customMaximumFractionDigits,
    unit: customUnit,
}: PrettyBytesProps): React.ReactElement => {
    let exponent;
    if (customUnit) {
        exponent = availableUnits.findIndex((unit) => unit === customUnit);
    } else {
        // log to base 1024
        // => receive exponent of equation 1024 ** exponent = bytes
        // => exponent determines unit
        exponent = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), availableUnits.length - 1);
    }
    const unit = availableUnits[exponent];
    const size = bytes / 1024 ** exponent;

    const maximumFractionDigits = customMaximumFractionDigits ?? 2;

    return <FormattedNumber value={size} style="unit" unit={unit} maximumFractionDigits={maximumFractionDigits} />;
};
