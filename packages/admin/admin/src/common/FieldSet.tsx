import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { ComponentsOverrides, Theme } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { css, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createSlot } from "../helpers/createSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export interface FieldSetProps
    extends ThemedComponentBaseProps<{
        root: typeof MuiAccordion;
        summary: typeof MuiAccordionSummary;
        headerColumn: "div";
        title: "div";
        supportText: "div";
        placeholder: "div";
        endAdornment: "div";
        children: typeof MuiAccordionDetails;
    }> {
    title: React.ReactNode;
    supportText?: React.ReactNode;
    endAdornment?: React.ReactNode;
    collapsible?: boolean;
    initiallyExpanded?: boolean;
    disablePadding?: boolean;
}

export type FieldSetClassKey =
    | "root"
    | "summary"
    | "headerColumn"
    | "title"
    | "supportText"
    | "endAdornment"
    | "placeholder"
    | "children"
    | "disablePadding";

type OwnerState = {
    disablePadding: boolean;
};

export function FieldSet(inProps: React.PropsWithChildren<FieldSetProps>): React.ReactElement {
    const {
        title,
        supportText,
        endAdornment,
        children,
        collapsible = true,
        initiallyExpanded = true,
        disablePadding = false,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFieldSet" });
    const [expanded, setExpanded] = React.useState(initiallyExpanded);

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    const ownerState: OwnerState = {
        disablePadding,
    };

    return (
        <Root
            expanded={expanded}
            onChange={
                collapsible
                    ? handleChange
                    : () => {
                          /* do nothing */
                      }
            }
            {...slotProps?.root}
            {...restProps}
        >
            <Summary expandIcon={collapsible && <ArrowForwardIosSharpIcon />} {...slotProps?.summary}>
                <HeaderColumn {...slotProps?.headerColumn}>
                    <Title {...slotProps?.title}>{title}</Title>
                    <SupportText {...slotProps?.supportText}>{supportText}</SupportText>
                </HeaderColumn>
                <Placeholder {...slotProps?.placeholder} />
                <EndAdornment {...slotProps?.endAdornment}>{endAdornment}</EndAdornment>
            </Summary>
            <Children ownerState={ownerState} {...slotProps?.children}>
                {disablePadding ? "disablePadding" : "not disablePadding"}
                {children}
            </Children>
        </Root>
    );
}

const Root = createSlot(MuiAccordion)<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "root",
})();

const Summary = createSlot(MuiAccordionSummary)<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "summary",
})(
    ({ theme }) => css`
        display: flex;
        flex-direction: row-reverse;
        padding: 0 10px;
        height: 80px;

        ${theme.breakpoints.up("sm")} {
            padding: 0 20px;
        }
    `,
);

const HeaderColumn = createSlot("div")<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "headerColumn",
})(
    ({ theme }) => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-content: center;
        padding: 0px;

        ${theme.breakpoints.up("sm")} {
            padding: 10px;
        }
    `,
);

const Title = createSlot("div")<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "title",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        font-weight: ${theme.typography.fontWeightMedium};
        font-size: 16px;
        text-transform: uppercase;
        color: ${theme.palette.text.primary};
    `,
);

const SupportText = createSlot("div")<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "supportText",
})(
    ({ theme }) => css`
        font-size: 12px;
        line-height: 18px;
        color: ${theme.palette.text.secondary};
    `,
);

const Placeholder = createSlot("div")<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "placeholder",
})(css`
    flex-grow: 1;
    box-sizing: inherit;
    user-select: none;
`);

const EndAdornment = createSlot("div")<FieldSetClassKey>({
    componentName: "FieldSet",
    slotName: "endAdornment",
})(css`
    display: flex;
    align-items: center;
`);

const Children = createSlot(MuiAccordionDetails)<FieldSetClassKey, OwnerState>({
    componentName: "FieldSet",
    slotName: "children",
    classesResolver(ownerState) {
        return [ownerState.disablePadding && "disablePadding"];
    },
})(
    ({ theme, ownerState }) => css`
        display: flex;
        flex-direction: column;
        border-top: 1px solid ${theme.palette.divider};
        padding: 20px;

        ${theme.breakpoints.up("sm")} {
            padding: 40px;
        }

        ${ownerState.disablePadding &&
        css`
            padding: 0;

            ${theme.breakpoints.up("sm")} {
                padding: 0;
            }
        `}
    `,
);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFieldSet: FieldSetProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFieldSet: FieldSetClassKey;
    }

    interface Components {
        CometAdminFieldSet?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFieldSet"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFieldSet"];
        };
    }
}
