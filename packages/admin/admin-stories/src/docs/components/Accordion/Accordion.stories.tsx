import { Accordion } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Accordion", module).add("BasicAccordion", () => {
    return (
        <Accordion title="This is a basic accordion" supportText="Support Text" endAdornment="End Adornment" initialExpanded={true}>
            <div>Content</div>
        </Accordion>
    );
});
