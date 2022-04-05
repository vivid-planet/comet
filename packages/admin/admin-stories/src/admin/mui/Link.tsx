import { Link } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const Story: React.FC = () => {
    return (
        <Link href="https://github.com/vivid-planet/comet-admin" target="_blank">
            Link with Default Styling
        </Link>
    );
};

storiesOf("@comet/admin/mui", module).add("Link", () => <Story />);
