/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Chip as MuiChip, css, InputBase, MenuItem, Paper as MuiPaper, styled, Typography } from "@mui/material";
import { emphasize } from "@mui/material/styles";

export type SelectClassKey =
    | "input"
    | "valueContainer"
    | "chip"
    | "chipFocused"
    | "noOptionsMessage"
    | "singleValue"
    | "placeholder"
    | "paper"
    | "indicatorsContainer"
    | "indicatorSeparator"
    | "clearIndicator"
    | "indicator"
    | "dropdownIndicator"
    | "option"
    | "optionSelected"
    | "optionFocused";

type OwnerState = { optionSelected: boolean; optionFocused: boolean };

export const ControlInput = styled(InputBase, {
    name: "CometAdminSelect",
    slot: "input",
    overridesResolver(_, styles) {
        return [styles.input];
    },
})(css`
    display: flex;
    padding-right: 0;
`);

export const ValueContainerSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "valueContainer",
    overridesResolver(_, styles) {
        return [styles.valueContainer];
    },
})(css`
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    align-items: center;
    overflow: hidden;
`);

const Chip = styled(MuiChip, {
    name: "CometAdminSelect",
    slot: "chip",
    overridesResolver(_, styles) {
        return [styles.chip];
    },
})(
    ({ theme }) => css`
        margin: ${theme.spacing(0.5)} ${theme.spacing(0.25)};
        outline: 10px solid green;
    `,
) as typeof MuiChip;

const ChipFocused = styled(MuiChip, {
    name: "CometAdminSelect",
    slot: "chipFocused",
    overridesResolver(_, styles) {
        return [styles.chipFocused];
    },
})(({ theme }) => {
    const backgroundColor = emphasize(theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700], 0.08);
    return css`
        background-color: ${backgroundColor};
    `;
});

export const NoOptionsMessageSlot = styled(Typography, {
    name: "CometAdminSelect",
    slot: "noOptionsMessage",
    overridesResolver(_, styles) {
        return [styles.noOptionsMessage];
    },
})(
    ({ theme }) => css`
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        color: ${theme.palette.text.secondary};
    `,
);

export const SingleValueSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "singleValue",
    overridesResolver(_, styles) {
        return [styles.singleValue];
    },
})(css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`);

export const PlaceholderSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "placeholder",
    overridesResolver(_, styles) {
        return [styles.placeholder];
    },
})(
    ({ theme }) => css`
        color: ${theme.palette.text.disabled};
    `,
);

export const PaperSlot = styled(MuiPaper, {
    name: "CometAdminSelect",
    slot: "paper",
    overridesResolver(_, styles) {
        return [styles.paper];
    },
})();

export const IndicatorsContainerSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "indicatorsContainer",
    overridesResolver(_, styles) {
        return [styles.indicatorsContainer];
    },
})(css`
    display: flex;
`);

//TODO check alignment of indicator + separator
//TODO check styling of separator

export const IndicatorSeparatorSlot = styled("span", {
    name: "CometAdminSelect",
    slot: "indicatorSeparator",
    overridesResolver(_, styles) {
        return [styles.indicatorSeparator];
    },
})(
    ({ theme }) => css`
        width: 1px;
        flex-grow: 1;
        background-color: ${theme.palette.divider};
    `,
);

//TODO check if slots are applied correctly

export const IndicatorSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "indicator",
    overridesResolver(_, styles) {
        return [styles.indicator];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.grey[500]};
        width: 32px;
        cursor: pointer;
    `,
);

export const ClearIndicatorSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "clearIndicator",
    overridesResolver(_, styles) {
        return [styles.indicator, styles.clearIndicator];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.grey[500]};
        width: 32px;
        cursor: pointer;
        font-size: 18px;
    `,
);

export const DropdownIndicatorSlot = styled("div", {
    name: "CometAdminSelect",
    slot: "dropdownIndicator",
    overridesResolver(_, styles) {
        return [styles.indicator, styles.dropdownIndicator];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.grey[500]};
        width: 32px;
        cursor: pointer;
        font-size: 20px;
    `,
);

type OptionSlotProps = {
    selected: boolean;
    isFocused: boolean;
};

export const OptionSlot = styled(MenuItem, {
    name: "CometAdminSelect",
    slot: "option",
    overridesResolver({ selected, isFocused }: OptionSlotProps, styles) {
        return [styles.option, isFocused && styles.optionFocused, selected && styles.optionSelected];
    },
})<OptionSlotProps>(
    ({ isFocused, selected, theme }) => css`
        ${selected &&
        css`
            font-weight: ${theme.typography.fontWeightMedium};
        `}

        ${isFocused &&
        css`
            background-color: ${theme.palette.grey[50]};
        `}
    `,
);
