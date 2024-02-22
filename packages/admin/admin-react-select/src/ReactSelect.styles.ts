import { Theme } from "@mui/material";
import { emphasize } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

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

const styles = (theme: Theme) =>
    createStyles<SelectClassKey, Record<string, unknown>>({
        input: {},
        valueContainer: {},
        chip: {},
        chipFocused: {
            backgroundColor: emphasize(theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
        },
        noOptionsMessage: {},
        singleValue: {},
        placeholder: {},
        paper: {},
        indicatorsContainer: {},
        indicatorSeparator: {},
        indicator: {},
        clearIndicator: {
            fontSize: 18,
        },
        dropdownIndicator: {
            fontSize: 20,
        },
        option: {},
        optionSelected: {
            fontWeight: theme.typography.fontWeightMedium,
        },
        optionFocused: {
            backgroundColor: theme.palette.grey[50],
        },
    });

export default styles;

// export const Input = styled(ControlInput, {
//     name: "CometAdminSelect",
//     slot: "input",
//     overridesResolver(_, styles) {
//         return [styles.input];
//     },
// })(css`
//     display: flex;
//     padding-right: 0;
// `);

// const ValueContainer = styled("div", {
//     name: "CometAdminSelect",
//     slot: "valueContainer",
//     overridesResolver(_, styles) {
//         return [styles.valueContainer];
//     },
// })(css`
//     display: flex;
//     flex-wrap: nowrap;
//     flex: 1;
//     align-items: center;
//     overflow: hidden;
// `);

// const Chip = styled(MuiChip, {
//     name: "CometAdminSelect",
//     slot: "chip",
//     overridesResolver(_, styles) {
//         return [styles.chip];
//     },
// })(
//     ({ theme }) => css`
//         margin: ${theme.spacing(0.5)} ${theme.spacing(0.25)};
//     `,
// );

// const ChipFocused = styled(MuiChip, {
//     name: "CometAdminSelect",
//     slot: "chipFocused",
//     overridesResolver(_, styles) {
//         return [styles.chipFocused];
//     },
// })(
//     ({ theme }) => css`
//         //   TODO: Add backgroundColor
//     `,
// );

// export const NoOptionsMessage = styled(Typography, {
//     name: "CometAdminSelect",
//     slot: "noOptionsMessage",
//     overridesResolver(_, styles) {
//         return [styles.noOptionsMessage];
//     },
// })(
//     ({ theme }) => css`
//         padding: ${theme.spacing(1)} ${theme.spacing(2)};
//         color: ${theme.palette.text.secondary};
//     `,
// );

// const SingleValue = styled("div", {
//     name: "CometAdminSelect",
//     slot: "singleValue",
//     overridesResolver(_, styles) {
//         return [styles.singleValue];
//     },
// })(css`
//     overflow: hidden;
//     text-overflow: "ellipsis";
//     white-space: "nowrap";
// `);

// const Placeholder = styled("div", {
//     name: "CometAdminSelect",
//     slot: "placeholder",
//     overridesResolver(_, styles) {
//         return [styles.placeholder];
//     },
// })(
//     ({ theme }) => css`
//         color: ${theme.palette.text.disabled};
//     `,
// );

// const Paper = styled(MuiPaper, {
//     name: "CometAdminSelect",
//     slot: "paper",
//     overridesResolver(_, styles) {
//         return [styles.paper];
//     },
// })();

// const IndicatorsContainer = styled("div", {
//     name: "CometAdminSelect",
//     slot: "indicatorsContainer",
//     overridesResolver(_, styles) {
//         return [styles.indicatorsContainer];
//     },
// })(css`
//     display: flex;
// `);

// const IndicatorSeparator = styled("span", {
//     name: "CometAdminSelect",
//     slot: "indicatorsSeparatpr",
//     overridesResolver(_, styles) {
//         return [styles.indicatorSeparator];
//     },
// })(
//     ({ theme }) => css`
//         width: 1;
//         flex-grow: 1;
//         background-color: ${theme.palette.divider};
//     `,
// );

// const Indicator = styled("div", {
//     name: "CometAdminSelect",
//     slot: "indicator",
//     overridesResolver(_, styles) {
//         return [styles.indicator];
//     },
// })(
//     ({ theme }) => css`
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         color: ${theme.palette.grey[500]};
//         width: 32px;
//         cursor: pointer;
//     `,
// );
