import { AppBar, type AppBarProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { type CSSProperties, useContext } from "react";

import { MasterLayoutContext } from "../mui/MasterLayoutContext";

export interface AppHeaderProps extends AppBarProps {
    /**
     * A custom height should only be set, if used outside of MasterLayout.
     */
    headerHeight?: number;
    /** The MasterLayout expects the header at the top of the window. */
    position?: "fixed" | "static";
}

export type AppHeaderClassKey = "root";

const Root = styled(AppBar)(
    ({ theme }) => css`
        position: fixed;
        inset-block-start: 0;
        inset-inline: 0;
        z-index: ${theme.zIndex.appBar};
        box-sizing: border-box;
        block-size: var(--header-height);
        min-block-size: 0;
        overflow: visible;

        &[data-position="static"] {
            position: static;
        }
    `,
);

export const AppHeader = ({ headerHeight: passedHeaderHeight, position = "fixed", style, ...restProps }: AppHeaderProps) => {
    const { headerHeight: masterLayoutHeaderHeight } = useContext(MasterLayoutContext);
    const headerHeight = passedHeaderHeight === undefined ? masterLayoutHeaderHeight : passedHeaderHeight;

    return <Root data-position={position} {...restProps} style={{ "--header-height": `${headerHeight}px`, ...style } as CSSProperties} />;
};
