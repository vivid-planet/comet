---
title: Writing Admin component docs
---

Each admin component should have a corresponding documentation page.

The page should be defined in Storybook (`storybook/src/admin-component-docs/`), it will then be used to generate the documentation page.

## Minimum requirements

Every docs page should include one `DefaultStory` that shows the minimal usage of the component.

It should allow setting all props using `argTypes`. Default values should not be set unless they are required or commonly used.

### Basic example for `MyComponent`

- Create a story file, e.g. `MyComponent.stories.tsx`
- Define the story `meta` as a default export
    - Use `commonComponentDocsMeta` to include the basic configuration for the documentation page
    - Set `component` to the component you want to document
    - Set `title` to the name of the component, prefixed with `Admin Components/`
    - Define the props of the component using `argTypes`
    - Where applicable, define the default values of the props using `args`
- Create a default story, named `DefaultStory`
- Add a concise description of the component above the `DefaultStory` to explain what it's used for

```tsx
import { MyComponent } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { commonComponentDocsMeta } from "./utils/commonComponentDocsMeta";

type Story = StoryObj<typeof MyComponent>;

const meta: Meta<typeof MyComponent> = {
    ...commonComponentDocsMeta,
    component: MyComponent,
    title: "Admin Components/MyComponent",
    argTypes: {
        children: {
            control: "text",
        },
        variant: {
            control: "select",
            options: [undefined, "primary", "secondary"],
        },
        highlighted: {
            control: "boolean",
        },
    },
    args: {
        children: "Hello World",
    },
};

export default meta;

/**
 * Used to display a text in a certain way.
 */
export const DefaultStory: Story = {};
```

## Additional information for docs

If you want to add additional information to the docs, e.g., for a special feature or information that may only be relevant in specific use cases, you can create a separate story in the same docs file with its own description, in addition to the default story.

`MyComponent.stories.tsx`

```tsx
/**
 * This explains what happens when using the `highlighted` prop.
 *
 * Something like this example should only be added if this use case
 * is not obvious or causes potentially unexpected behavior.
 */
export const HighlightedExample: Story = {
    render: (props) => {
        return <MyComponent {...props} highlighted />;
    },
};
```

## Structure for components that include a field variant

If a component is created for usage inside forms and includes a separate variant for usage inside final form, it should mention the existence of the field component but document the field component separately.

Consider defining `argTypes` as a separate variable that can be imported by the docs page of the field variant of the component.

`MyInputComponent.stories.tsx`

```tsx
import { MyInputComponent } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { commonComponentDocsMeta } from "./utils/commonComponentDocsMeta";

type Story = StoryObj<typeof MyInputComponent>;

export const argTypes = {
    variant: {
        control: "select",
        options: [undefined, "primary", "secondary"],
    },
    highlighted: {
        control: "boolean",
    },
} as const;

const meta: Meta<typeof MyInputComponent> = {
    ...commonComponentDocsMeta,
    component: MyInputComponent,
    title: "Admin Components/MyInputComponent",
    argTypes,
};

export default meta;

/**
 * Used to input a certain type of value in a form.
 *
 * For usage inside final-form, use the `MyInputComponentField` component.
 */
export const DefaultStory: Story = {};
DefaultStory.name = "MyInputComponent";
```

## Structure for field components

Create a separate docs page for the field variant of a component.  
Mention the non-field variant of the component in the default story's description.

Make sure to define the same props the non-field component would use and also include the common props of field components.

Additionally, the default story must render a final-form as a wrapper, as this is necessary for the component to function.

`MyInputComponentField.stories.tsx`

```tsx
import { MyInputComponentField } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { argTypes, args } from "./MyInputComponent.stories";
import { commonComponentDocsMeta } from "./utils/commonComponentDocsMeta";
import { commonFieldComponentArgTypes } from "./utils/common";

type Story = StoryObj<typeof MyInputComponentField>;

const meta: Meta<typeof MyInputComponentField> = {
    ...commonComponentDocsMeta,
    component: MyInputComponentField,
    title: "Admin Components/MyInputComponentField",
    argTypes: {
        ...argTypes,
        ...commonFieldComponentArgTypes,
    },
};

export default meta;

/**
 * Used to input a certain type of value in a final form.
 *
 * For usage outside of final-form, use the `MyInputComponent` component.
 */
export const DefaultStory: Story = {
    render: (props) => {
        return (
            <FinalForm mode="edit" onSubmit={() => {}}>
                <MyInputComponentField {...props} />
            </FinalForm>
        );
    },
};
DefaultStory.name = "MyInputComponentField";
```
