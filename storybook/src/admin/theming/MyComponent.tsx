// NOTE: Everything below this line should be copied into the docs file when something is changed: comet-core-development/create-admin-components-with-theme-support.md
import { createComponentSlot, ThemedComponentBaseProps } from "@comet/admin";
import { CometColor } from "@comet/admin-icons";
import { ComponentsOverrides, css, Theme, Typography, useThemeProps } from "@mui/material";
import React from "react";

/**
 * The `{ComponentName}ClassKey` type defines all the individual elements (or slots) of a component or a modifier or alternative style of a component.
 * - `root` is generally the outermost element of the component.
 * - `header` in this case would be the header element of the component.
 * - `hasShadow` would be a modifier class added to the root element when the `shadow` prop is set to `true`.
 */
export type MyComponentClassKey = "root" | "header" | "title" | "typography" | "children" | "hasShadow";

/**
 * The `OwnerState` is an object that includes all values that should impact the component's styling.
 * In this case, the `shadow` prop is the only thing that changes the component's styling, so it is the only value included in the `OwnerState`.
 * It is passed into every slot that requires any of these values for its styling, in this case, the `root` and `title` slots.
 */
type OwnerState = Pick<MyComponentProps, "shadow">;

/**
 * Each element or sub-component of a Comet Admin component should be created as a "slot".
 * A slot is created by using the `createComponentSlot` function and passing in the HTML element or component you want to be the base of your slot.
 * The slot's options require:
 * - `componentName`: This is used to reference the component in the theme, so it must be the same for every slot in the component. It will be automatically prefixed with `CometAdmin`.
 * - `slotName`: This name is used to reference the slot when overriding component styles or default-props in the theme, or when passing in slotProps to the component.
 * - `classesResolver`: This function determines which class-key's `styleOverrides` and `className` to apply to the slot.
 *    The class-key of the `slotName`, e.g., `root` is always added to the slot automatically.
 *    If a slot has styles dependent on a value in the `ownerState`, e.g. from a `shadow` prop, then a class-key (e.g. `hasShadow`) should be returned to allow those styles to be overridden using the theme.
 */
const Root = createComponentSlot("div")<MyComponentClassKey, OwnerState>({
    componentName: "MyComponent",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.shadow && "hasShadow"];
    },
})(
    ({ theme, ownerState }) => css`
        background-color: ${theme.palette.background.paper};

        ${ownerState.shadow &&
        css`
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
        `}
    `,
);

const Header = createComponentSlot("div")<MyComponentClassKey>({
    componentName: "MyComponent",
    slotName: "header",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(4)};
    `,
);

const Title = createComponentSlot(Typography)<MyComponentClassKey, OwnerState>({
    componentName: "MyComponent",
    slotName: "title",
})(
    ({ ownerState }) => css`
        ${ownerState.shadow &&
        css`
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        `}
    `,
);

const Children = createComponentSlot("div")<MyComponentClassKey>({
    componentName: "MyComponent",
    slotName: "children",
})(
    ({ theme }) => css`
        padding: ${theme.spacing(4)};
    `,
);

/**
 * The `{ComponentName}Props` type defines all of the component's props and should extend `ThemedComponentBaseProps`.
 * `ThemedComponentBaseProps` adds the props necessary for overriding the component's styles by adding the `sx`, `className` and `slotProps` props.
 * If the component has multiple slots, pass in a generic/object with the slots as keys and their types as values.
 */
export interface MyComponentProps
    extends ThemedComponentBaseProps<{
        root: "div";
        header: "div";
        title: typeof Typography;
        children: "div";
    }> {
    iconMapping?: {
        header?: React.ReactNode;
    };
    title: React.ReactNode;
    children?: React.ReactNode;
    shadow?: boolean;
}

export function MyComponent(inProps: MyComponentProps) {
    /**
     * A component should never use the passed-in props directly but get them through the `useThemeProps` hook.
     * This merges the components `defaultProps` from the theme with the passed-in props.
     */
    const { title, children, shadow, iconMapping = {}, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminMyComponent" });
    const { header: headerIcon = <CometColor /> } = iconMapping;

    const ownerState: OwnerState = {
        shadow,
    };

    /**
     * Ensure the `sx` and `className` props are passed into the root slot.
     * In this case, this is done with `...restProps`.
     */
    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <Header {...slotProps?.header}>
                <Title ownerState={ownerState} variant="h4" {...slotProps?.title}>
                    {title}
                </Title>
                {headerIcon}
            </Header>
            <Children {...slotProps?.children}>{children}</Children>
        </Root>
    );
}

/**
 * Add your components Props and ClassKey types to the MUI type definitions, so they can be used in the theme.
 */
declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMyComponent: MyComponentProps;
    }

    interface ComponentNameToClassKey {
        CometAdminMyComponent: MyComponentClassKey;
    }

    interface Components {
        CometAdminMyComponent?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMyComponent"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMyComponent"];
        };
    }
}
