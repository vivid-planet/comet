import { css } from "@mui/material/styles";

/** Centers the first line of a checkbox, switch or radio on a text input's height, so it lines up with the label of a horizontal field. */
export const toggleControlPadding = css`
    padding-block: calc(
        (var(--dextinity-control-height-medium) - var(--dextinity-typography-body-font-size) * var(--dextinity-typography-body-line-height)) / 2
    );
`;

export const getToggleControlListLayout = (layout: "row" | "column") => css`
    ${toggleControlPadding}
    display: flex;
    flex-direction: ${layout};
    flex-wrap: wrap;
    gap: var(--dextinity-space-sm) var(--dextinity-space-xl);
`;
