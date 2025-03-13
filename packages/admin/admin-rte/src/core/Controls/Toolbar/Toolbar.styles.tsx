import { createComponentSlot } from "@comet/admin";
import { css } from "@mui/material/styles";

import getRteTheme from "../../utils/getRteTheme";

export type RteToolbarClassKey = "root" | "slot";

export const Root = createComponentSlot("div")<RteToolbarClassKey>({
    componentName: "RteToolbar",
    slotName: "root",
})(
    ({ theme }) => css`
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid ${getRteTheme(theme.components?.CometAdminRte?.defaultProps).colors?.border};
        background-color: ${getRteTheme(theme.components?.CometAdminRte?.defaultProps).colors?.toolbarBackground};
        padding-left: 6px;
        padding-right: 6px;
        overflow: hidden;
    `,
);

export const Slot = createComponentSlot("div")<RteToolbarClassKey>({
    componentName: "RteToolbar",
    slotName: "slot",
})(
    ({ theme }) => css`
        position: relative;
        flex-shrink: 0;
        flex-grow: 0;
        height: 34px;
        box-sizing: border-box;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 6px;
        margin-right: 5px;

        &::before,
        &::after {
            content: "";
            position: absolute;
            background-color: ${getRteTheme(theme.components?.CometAdminRte?.defaultProps).colors?.border};
        }

        &::before {
            bottom: 0;
            height: 1px;
            left: -100vw;
            right: -100vw;
        }

        &::after {
            top: 8px;
            right: 0;
            bottom: 8px;
            width: 1px;
        }

        &:last-child {
            margin-right: 0;
        }

        &:last-child::after {
            display: none;
        }
    `,
);
