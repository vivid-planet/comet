---
title: Create admin-components with theme support
---

MUI components allow their styles & default props to be overridden using the theme.
They also allow overriding of the styles of individual components using the `sx` prop.

All Comet Admin components should support the same features.

The basics of how to implement this can be found in the MUI docs: https://mui.com/material-ui/guides/creating-themed-components/

## Examples of how you should be able to override components

### Setting a component's default props

E.g.: every instance of `MyComponent` should have a shadow by default.

```ts
const theme = createCometTheme({
    components: {
        CometAdminMyComponent: {
            defaultProps: {
                shadow: true,
            },
        },
    },
});
```

### Overriding the styles of a component

E.g.: in every instance of `MyComponent`, the root should have a red border, and the header should be lime.

```ts
const theme = createCometTheme({
    components: {
        CometAdminMyComponent: {
            styleOverrides: {
                root: {
                    borderColor: "red",
                },
                header: {
                    backgroundColor: "lime",
                },
            },
        },
    },
});
```

### Overriding the styles of a single instance of a component

E.g.: in this instance of `MyComponent`, the root should have a red border, and the header should be lime.

```tsx
<MyComponent
    sx={{ borderColor: "red" }}
    slotProps={{ header: { sx: { backgroundColor: "lime" } } }}
/>
```

## Example component

```tsx
import { CometColor } from "@comet/admin-icons";
import { ComponentsOverrides, Typography } from "@mui/material";
import { css, styled, SxProps, Theme, useThemeProps } from "@mui/material/styles";
import React from "react";

import { SlotProps } from "./helpers/SlotProps";

/**
 * The `{ComponentName}ClassKey` type defines all the individual elements (or slots) of a component or a modifier or alternative style of a component.
 * - `root` is generally the outermost element of the component.
 * - `header` in this case would be the header element of the component.
 * - `hasShadow` would be a modifier class added to the root element when the `shadow` prop is set to `true`.
 */
export type MyComponentClassKey = "root" | "header" | "typography" | "icon" | "children" | "hasShadow";

type RootProps = Pick<MyComponentProps, "shadow">;

/**
 * Each element or sub-component of a Comet Admin component should be created as a "slot".
 * A slot is created by using the `styled` function from `@mui/material/styles` and passing in the HTML element or component you want to be the base of your slot.
 * The slot's options require:
 * - `name`: The name of the component, prefixed by `CometAdmin`.
 *    This name is used to reference the component in the theme, so it must be the same for every slot in the component.
 * - `slot`: The name of the slot. This name is used to reference the slot when overriding component styles or default-props.
 * - `overridesResolver`: The function that applies the styles from the theme's styleOverrides to the slot.
 *    This should always return the styles of the slot's name, e.g. `styles.root` for the Root slot.
 *    If the slot has modifier styles, e.g. `styles.hasShadow`, then those should be returned as well when the modifier prop is set to `true`.
 */
const Root = styled("div", {
    name: "CometAdminMyComponent",
    slot: "Root",
    overridesResolver({ shadow }: RootProps, styles) {
        return [styles.root, shadow && styles.hasShadow];
    },
})<RootProps>(
    ({ theme, shadow }) => css`
        background-color: ${theme.palette.background.paper};

        ${shadow &&
        css`
            box-shadow: 2px 2px 0 5px rgba(0, 0, 0, 0.25);
        `}
    `,
);

const Header = styled("div", {
    name: "CometAdminMyComponent",
    slot: "Header",
    overridesResolver(_, styles) {
        return [styles.header];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(4)};
    `,
);

const Title = styled(Typography, {
    name: "CometAdminMyComponent",
    slot: "Title",
    overridesResolver(_, styles) {
        return [styles.title];
    },
})();

const Icon = styled(CometColor, {
    name: "CometAdminMyComponent",
    slot: "Icon",
    overridesResolver(_, styles) {
        return [styles.icon];
    },
})();

const Children = styled("div", {
    name: "CometAdminMyComponent",
    slot: "Children",
    overridesResolver(_, styles) {
        return [styles.children];
    },
})(
    ({ theme }) => css`
        padding: ${theme.spacing(4)};
    `,
);

/**
 * The `{ComponentName}Props` type defines all of the component's props.
 * The following props are required by all Comet Admin components:
 * - `sx`: Used to override the styles of the root slot of a component.
 * - `slotProps`: Used to override the props and the styling (through the slot's `sx` prop) of each slot of a component.
 */
export interface MyComponentProps {
    title: React.ReactNode;
    children?: React.ReactNode;
    shadow?: boolean;
    sx?: SxProps<Theme>;
    slotProps?: {
        root?: SlotProps<"div">;
        header?: SlotProps<"div">;
        title?: SlotProps<typeof Typography>;
        icon?: SlotProps<typeof CometColor>;
        children?: SlotProps<"div">;
    };
}

export function MyComponent(inProps: MyComponentProps) {
    /**
     * A component should never use the passed-in props directly but get them through the `useThemeProps` hook.
     * This merges the components `defaultProps` from the theme with the passed-in props.
     */
    const { title, children, shadow, slotProps = {}, sx } = useThemeProps({ props: inProps, name: "CometAdminMyComponent" });

    return (
        <Root shadow={shadow} sx={sx} {...slotProps?.root}>
            <Header {...slotProps?.header}>
                <Title variant="h4" {...slotProps?.title}>
                    {title}
                </Title>
                <Icon {...slotProps?.icon} />
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
```
