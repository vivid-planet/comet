import { Translate } from "@comet/admin-icons";
import { Button, InputBase, Tooltip } from "@mui/material";
import * as React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { useContentTranslationService } from "../translator/useContentTranslationService";
import { FinalFormInputProps } from "./FinalFormInput";

export function FinalFormCurrencyInput({
    meta,
    input,
    innerRef,
    clearable,
    endAdornment,
    disableContentTranslation,
    currencySign,
    currencySignPosition,
    ...props
}: FinalFormInputProps): React.ReactElement {
    const { enabled, translate } = useContentTranslationService();
    const intl = useIntl();
    const [formattedCurrencyValue, setFormattedCurrencyValue] = React.useState("");

    function getFormattedValue(value: number, intl: IntlShape, currencySignPosition: string) {
        if (currencySignPosition === "before") {
            const formattedValue = `${currencySign} ${value ? intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}`;
            return formattedValue;
        } else {
            const formattedValue = `${value ? intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""} ${currencySign}`;
            return formattedValue;
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedCurrencyValue(value);
    };

    const handleBlur = () => {
        const numericValue = parseFloat(formattedCurrencyValue.replace(/[^0-9.]/g, ""));
        input.onChange(numericValue);
        setFormattedCurrencyValue(getFormattedValue(numericValue, intl, currencySignPosition));
    };

    return (
        <InputBase
            {...input}
            {...props}
            value={formattedCurrencyValue}
            onChange={handleChange}
            onBlur={handleBlur}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {enabled && !disableContentTranslation && (
                        <Tooltip title={<FormattedMessage id="comet.translate" defaultMessage="Translate" />}>
                            <Button onClick={async () => input.onChange(await translate(input.value))}>
                                <Translate />
                            </Button>
                        </Tooltip>
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
