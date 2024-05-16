import { FinalForm, NumberField } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../../../apollo-rest-story.decorator";

storiesOf("stories/Form/Components", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("NumberField", () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <NumberField name="number" label="Number" fullWidth />
            </FinalForm>
        );
    });

storiesOf("stories/Form/Components", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("WithDecimals", () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <NumberField name="number" label="Number with three decimals" decimals={3} fullWidth />
            </FinalForm>
        );
    });

storiesOf("stories/Form/Components", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("Currency", () => {
        return (
            <FinalForm mode="add" onSubmit={() => {}}>
                <NumberField name="number" label="Currency with currency sign before the value" startAdornment="€" decimals={2} fullWidth />
                <NumberField name="number" label="Currency with currency sign after the value" endAdornment="€" decimals={2} fullWidth />
            </FinalForm>
        );
    });
