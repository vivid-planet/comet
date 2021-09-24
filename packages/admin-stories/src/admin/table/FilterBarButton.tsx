import { FilterBarButton } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return <FilterBarButton endIcon={<ChevronDown />}> Filter Button </FilterBarButton>;
}

storiesOf("@comet/admin/table", module).add("Filter Bar Button", () => {
    return <Story />;
});
