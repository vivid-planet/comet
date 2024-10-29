import * as React from "react";
import { FormattedDate, FormattedTime } from "react-intl";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";

export default {
    title: "@comet/admin/react-intl",
    decorators: [apolloRestStoryDecorator()],
};

export const FormatLocalized = () => {
    const date = new Date();
    return (
        <>
            <FormattedDate value={date} weekday="short" day="2-digit" month="2-digit" year="numeric" /> - <FormattedTime value={date} />
        </>
    );
};

FormatLocalized.storyName = "FormatLocalized";
