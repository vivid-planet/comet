import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { Popover, useTheme } from "@material-ui/core";
import { PopoverProps } from "@material-ui/core/Popover/Popover";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { AppHeaderButton, AppHeaderButtonProps } from "../button/AppHeaderButton";
import { CometAdminAppHeaderDropdownClassKeys, useStyles } from "./AppHeaderDropdown.styles";

interface Props extends AppHeaderButtonProps {
    children?: ((closeDropdown: () => void) => React.ReactNode) | React.ReactNode;
    buttonChildren?: React.ReactNode;
    dropdownArrow?: ((isOpen: boolean) => React.ReactNode) | null;
    popoverProps?: Partial<PopoverProps>;
    customShowContentState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

function DefaultArrowUp(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronUp htmlColor={palette.primary.contrastText} />;
}

function DefaultArrowDown(): React.ReactElement {
    const { palette } = useTheme();
    return <ChevronDown htmlColor={palette.primary.contrastText} />;
}

export function AppHeaderDropdown({
    children,
    buttonChildren,
    dropdownArrow = (isOpen) => (isOpen ? <DefaultArrowUp /> : <DefaultArrowDown />),
    popoverProps,
    customShowContentState,
    classes: passedClasses,
    ...restProps
}: Props & StyledComponentProps<CometAdminAppHeaderDropdownClassKeys>): React.ReactElement {
    const defaultShowContentState = React.useState<boolean>(false);
    let [showContent, setShowContent] = defaultShowContentState;

    if (customShowContentState !== undefined) {
        [showContent, setShowContent] = customShowContentState;
    }

    const [itemWidth, setItemWidth] = React.useState<number>(0);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const classes = mergeClasses<CometAdminAppHeaderDropdownClassKeys>(useStyles({ itemWidth }), passedClasses);

    React.useEffect(() => {
        if (rootRef.current) {
            setItemWidth(rootRef.current.clientWidth);
        }
    }, []);

    return (
        <div className={classes.root} ref={rootRef}>
            <AppHeaderButton
                endIcon={dropdownArrow !== null ? dropdownArrow(showContent) : undefined}
                {...restProps}
                onClick={() => setShowContent(true)}
            >
                {buttonChildren}
            </AppHeaderButton>
            <Popover
                classes={{ root: classes.popoverRoot, paper: classes.popoverPaper }}
                open={showContent}
                anchorEl={rootRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onBackdropClick={() => setShowContent(false)}
                marginThreshold={0}
                {...popoverProps}
            >
                {typeof children === "function" ? children(() => setShowContent(false)) : children}
            </Popover>
        </div>
    );
}
