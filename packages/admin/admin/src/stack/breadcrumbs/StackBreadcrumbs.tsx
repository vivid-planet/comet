import { ChevronRight } from "@comet/admin-icons";
import { Breadcrumbs as MuiBreadcrumbs, BreadcrumbsProps, ComponentsOverrides, Theme, useTheme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import useResizeAware from "react-resize-aware";

import { useStackApi } from "../Api";
import { BreadcrumbOverflow } from "./BreadcrumbOverflow";
import { getBreadcrumbLinkNodes } from "./getBreadcrumbLinkNodes";
import { StackBreadcrumbsClassKey, styles } from "./StackBreadcrumbs.styles";
import { useNumberOfItemsToBeHidden } from "./useNumberOfItemsToBeHidden";

export type StackBreadcrumbsProps = Omit<BreadcrumbsProps, "maxItems" | "itemsAfterCollapse">;

const StackBreadcrumbsComponent = ({
    separator,
    itemsBeforeCollapse = 1,
    classes,
    ...otherProps
}: StackBreadcrumbsProps & WithStyles<typeof styles>): React.ReactElement | null => {
    const stackApi = useStackApi();
    const { palette } = useTheme();
    const breadcrumbsRef = React.useRef<HTMLElement>(null);
    const [breadcrumbsResizeListener, { width: breadcrumbsContainerWidth }] = useResizeAware();

    const numberOfItemsToBeHidden = useNumberOfItemsToBeHidden(breadcrumbsRef.current, breadcrumbsContainerWidth, itemsBeforeCollapse);

    if (!stackApi?.breadCrumbs.length) return null;

    const breadcrumbItemsBeforeCollapse = stackApi.breadCrumbs.slice(0, itemsBeforeCollapse);
    const breadcrumbItemsAfterCollapse = stackApi.breadCrumbs.slice(itemsBeforeCollapse, stackApi.breadCrumbs.length);
    const breadcrumbItemsInsideOverflowMenu = breadcrumbItemsAfterCollapse.splice(0, numberOfItemsToBeHidden ?? 0);

    return (
        <div className={classes.root}>
            {breadcrumbsResizeListener}
            <MuiBreadcrumbs
                ref={breadcrumbsRef}
                maxItems={stackApi.breadCrumbs.length + 1} // Prevent the default collapse behavior to use our own overflow menu.
                classes={{ root: classes.breadcrumbs, ol: classes.ol, li: classes.li, separator: classes.separator }}
                separator={separator === undefined ? <ChevronRight fontSize="inherit" htmlColor={palette.grey[900]} /> : separator}
                {...otherProps}
            >
                {getBreadcrumbLinkNodes(
                    breadcrumbItemsBeforeCollapse,
                    breadcrumbItemsBeforeCollapse.length === stackApi.breadCrumbs.length,
                    classes,
                    stackApi.breadCrumbs.length > 1 ? stackApi.breadCrumbs[stackApi.breadCrumbs.length - 2].url : undefined,
                )}
                {(breadcrumbItemsInsideOverflowMenu.length || numberOfItemsToBeHidden === null) && (
                    <BreadcrumbOverflow items={breadcrumbItemsInsideOverflowMenu} classes={classes} />
                )}
                {getBreadcrumbLinkNodes(breadcrumbItemsAfterCollapse, true, classes)}
            </MuiBreadcrumbs>
        </div>
    );
};

export const StackBreadcrumbs = withStyles(styles, { name: "CometAdminStackBreadcrumbs" })(StackBreadcrumbsComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: StackBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: StackBreadcrumbsProps;
    }

    interface Components {
        CometAdminStackBreadcrumbs?: {
            defaultProps?: ComponentsPropsList["CometAdminStackBreadcrumbs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBreadcrumbs"];
        };
    }
}
