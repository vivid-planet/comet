import { Tooltip as UiTooltip, type TooltipProps as UiTooltipProps, type TooltipSide, type TooltipSlotProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from "react";

type Side = "top" | "bottom" | "left" | "right";
type Placement = Side | `${Side}-start` | `${Side}-end`;
type Color = "light" | "dark" | "error" | "success" | "warning";

export interface TooltipProps extends Omit<
    UiTooltipProps,
    "content" | "side" | "children" | "showArrow" | "color" | "className" | "slotProps" | "title"
> {
    /** The element the tooltip belongs to. It must pass its props and `ref` on to an element that can receive focus. */
    children: ReactElement<{ className?: string }>;
    title?: ReactNode;
    description?: ReactNode;
    customContent?: ReactNode;
    /**
     * The side of the child the tooltip opens on, and its alignment along it.
     *
     * @defaultValue `"top"`
     */
    placement?: Placement;
    /** @defaultValue `"dark"` */
    color?: Color;
    /** Shows an arrow that points at the child. */
    arrow?: boolean;
    /** Added to the classes of the child, the element the tooltip belongs to. */
    className?: string;
    /** Props for the parts of the tooltip: `popup`, `positioner` and `arrow`, and the `title` and `text` of a tooltip with a `description`. */
    slotProps?: TooltipSlotProps & {
        title?: Partial<ComponentProps<"span">>;
        text?: Partial<ComponentProps<"span">>;
    };
}

type Slot = "root" | "title" | "text";
type ComponentState = "hasTitleOnly";

export type TooltipClassKey = Slot | Color | ComponentState | "popper" | "tooltip" | "arrow";

type OwnerState = {
    color: Color;
    hasTitleOnly: boolean;
};

const placementSideToTooltipSide: Record<Side, TooltipSide> = {
    top: "top",
    bottom: "bottom",
    left: "inline-start",
    right: "inline-end",
};

export const Tooltip = (props: TooltipProps) => {
    const {
        color = "dark",
        placement = "top",
        arrow,
        children,
        title,
        description,
        customContent,
        className,
        slotProps = {},
        tabIndex = 0,
        disabled,
        ...restProps
    } = props;

    if (customContent && (title || description)) {
        throw new Error("You cannot provide a `title` or `description` when using custom content via the `customContent` prop.");
    }

    if (!("title" in props) && !customContent) {
        throw new Error("You must provide a `title` or `customContent` when using the `Tooltip` component.");
    }

    const ownerState: OwnerState = { color, hasTitleOnly: !description && !customContent };
    const { title: titleSlotProps, text: textSlotProps, positioner: positionerSlotProps, ...uiSlotProps } = slotProps;
    const [placementSide, placementAlign = "center"] = placement.split("-") as [Side, "start" | "end" | undefined];

    const content = getContent({ title, description, customContent }, { title: titleSlotProps, text: textSlotProps });

    return (
        <Root
            {...restProps}
            ownerState={ownerState}
            tabIndex={tabIndex}
            disabled={disabled || !hasContent(content)}
            content={content}
            side={placementSideToTooltipSide[placementSide]}
            showArrow={arrow}
            slotProps={{
                ...uiSlotProps,
                positioner: (positionerOwnerState) => ({
                    align: placementAlign,
                    ...(typeof positionerSlotProps === "function" ? positionerSlotProps(positionerOwnerState) : positionerSlotProps),
                }),
            }}
        >
            {className ? cloneElement(children, { className: [children.props.className, className].filter(Boolean).join(" ") }) : children}
        </Root>
    );
};

type TooltipContentProps = Pick<TooltipProps, "title" | "description" | "customContent">;
type TooltipContentSlotProps = Pick<NonNullable<TooltipProps["slotProps"]>, "title" | "text">;

const getContent = ({ title, description, customContent }: TooltipContentProps, slotProps: TooltipContentSlotProps) => {
    if (typeof customContent !== "undefined") {
        return customContent;
    }

    if (description) {
        return (
            <>
                <Title {...slotProps.title}>{title}</Title>
                <Text {...slotProps.text}>{description}</Text>
            </>
        );
    }

    if (!title) {
        return title;
    }

    return <Text {...slotProps.text}>{title}</Text>;
};

const hasContent = (content: ReactNode) => content !== undefined && content !== null && content !== false && content !== "";

const Root = styled(UiTooltip)<{ ownerState: OwnerState }>(({ theme, ownerState }) => {
    const backgroundColors: Partial<Record<Color, string>> = {
        light: theme.palette.common.white,
        error: theme.palette.error.light,
        success: theme.palette.success.light,
        warning: theme.palette.warning.light,
    };
    const backgroundColor = backgroundColors[ownerState.color];

    return css`
        ${
            backgroundColor &&
            css`
                background: ${backgroundColor};
                color: ${theme.palette.text.primary};
            `
        }

        ${
            !ownerState.hasTitleOnly &&
            css`
                min-inline-size: 200px;
                padding: ${theme.spacing(2)};
            `
        }
    `;
});

const Title = styled("span")(css`
    display: block;
    margin-block-end: 2px;
    font-weight: var(--dextinity-typography-label-font-weight);
`);

const Text = styled("span")(css`
    display: block;
`);
