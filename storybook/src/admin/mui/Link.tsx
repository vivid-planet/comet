import { Link } from "@mui/material";
import * as React from "react";

const Story: React.FC = () => {
    return (
        <Link href="https://github.com/vivid-planet/comet" target="_blank">
            Link with Default Styling
        </Link>
    );
};

export default {
    title: "@comet/admin/mui",
};

export const _Link = () => <Story />;
