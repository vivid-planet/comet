---
title: Writing Admin component docs
---

Each admin-component should have a corresponding documentation page.

The page should be defined in storybook (`storybook/src/admin-component-docs/`), it will then be used to generate the documentation page in the docs.

## Minimum requirements

Every docs page should include one `DefaultStory` that shows the minimal usage of the component.

It should allow setting all props using `argTypes`, default values should not be set, unless they are required or basically always used.

### Simple example for the component `MyComponent`

- Create a story file, e.g. `MyComponent.stories.tsx`
- Define the story config as a default export
    - Set `component` to the component you want to document
    - Set `title` to the name of the component, prefixed with `Admin Components/`
    - Define the props of the component using `argTypes`
    - Where applicable, define the default values of the props using `args` (optional booleans should always be set to `false` here)
    - Include `heightCommunicationDecorator` in the `decorators` array to ensure correct rendering in the docs
- Create the `DefaultStory` and set it's name to the component's name
- Add a concise description of the component above the `DefaultStory` to explain what it's used for

```tsx
import { MyComponent } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { heightCommunicationDecorator } from "../helpers/storyDecorators";

type Story = StoryObj<typeof MyComponent>;

const config: Meta<typeof MyComponent> = {
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
        highlighted: false,
    },
    decorators: [heightCommunicationDecorator()],
};

export default config;

/**
 * Used to display a text in a certain way.
 */
export const DefaultStory: Story = {};
DefaultStory.name = "MyComponent";
```

## Additional information for docs

If you want to add additional information to the docs, e.g., for a special feature or information that may only be relevant in certain use-cases, you can create a separate story in the same docs file with it's own description, in addition to the default story.

`MyComponent.stories.tsx`

```tsx
/**
 * This explains what happens when using the `highlighted` prop.
 *
 * Something like this example should only be added if this use-case
 * is not obvious or causes possibly unexpected behavior.
 */
export const MyComponentHighlightedStory: Story = {
    render: (props) => {
        return <MyComponent {...props} highlighted />;
    },
};
MyComponentHighlightedStory.name = "MyComponentHighlightedStory";
```

## Structure for components that include a field variant

If a component created for usage inside forms and includes a separate variant for usage inside final form, it should mention the existence of the field component but not include the field component in the docs.

Consider defining `argTypes` and `args` as a separate variable that can be imported by the docs page of the field-variant of the component.

`MyInputComponent.stories.tsx`

```tsx
import { MyInputComponent } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { heightCommunicationDecorator } from "../helpers/storyDecorators";

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

export const args = {
    highlighted: false,
} as const;

const config: Meta<typeof MyInputComponent> = {
    component: MyInputComponent,
    title: "Admin Components/MyInputComponent",
    argTypes,
    args,
    decorators: [heightCommunicationDecorator()],
};

export default config;

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
import { heightCommunicationDecorator } from "../helpers/storyDecorators";
import { commonFieldComponentArgs, commonFieldComponentArgTypes } from "./utils/common";

type Story = StoryObj<typeof MyInputComponentField>;

const config: Meta<typeof MyInputComponentField> = {
    component: MyInputComponentField,
    title: "Admin Components/MyInputComponentField",
    argTypes: {
        ...argTypes,
        ...commonFieldComponentArgTypes,
    },
    args: {
        ...args,
        ...commonFieldComponentArgs,
    },
    decorators: [heightCommunicationDecorator()],
};

export default config;

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
