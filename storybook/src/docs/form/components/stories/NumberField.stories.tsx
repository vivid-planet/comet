import { FinalForm, NumberField } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/Form/Components/NumberField",
};

export const _NumberField = {
    render: () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <NumberField name="number" label="Number" fullWidth />
            </FinalForm>
        );
    },

    name: "NumberField",
};

export const WithDecimals = {
    render: () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <NumberField name="number" label="Number with three decimals" decimals={3} fullWidth />
            </FinalForm>
        );
    },

    name: "WithDecimals",
};

export const Currency = () => {
    return (
        <FinalForm mode="add" onSubmit={() => {}}>
            <NumberField name="number" label="Currency with currency sign before the value" startAdornment="€" decimals={2} fullWidth />
            <NumberField name="number" label="Currency with currency sign after the value" endAdornment="€" decimals={2} fullWidth />
        </FinalForm>
    );
};
