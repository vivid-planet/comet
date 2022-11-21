import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedDate, FormattedTime } from "react-intl";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";

function Story() {
    const date = new Date();
    return (
        <>
            <FormattedDate value={date} weekday="short" day="2-digit" month="2-digit" year="numeric" /> - <FormattedTime value={date} />
        </>
    );
}

storiesOf("@comet/admin/react-intl", module)
    .addDecorator(apolloRestStoryDecorator())
    .add("FormatLocalized", () => <Story />);
