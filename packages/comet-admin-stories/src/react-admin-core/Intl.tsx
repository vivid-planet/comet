import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedDate, FormattedTime } from "react-intl";

import { apolloStoryDecorator } from "../apollo-story.decorator";

function Story() {
    const date = new Date();
    return (
        <>
            <FormattedDate value={date} weekday="short" day="2-digit" month="2-digit" year="numeric" /> - <FormattedTime value={date} />
        </>
    );
}

storiesOf("react-intl", module)
    .addDecorator(apolloStoryDecorator())
    .add("FormatLocalized", () => <Story />);
