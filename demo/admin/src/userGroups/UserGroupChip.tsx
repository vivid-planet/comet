import { Box, Chip } from "@mui/material";
import { type GQLUserGroup } from "@src/graphql.generated";

import { userGroupOptions } from "./userGroupOptions";

interface Props {
    item: {
        userGroup: GQLUserGroup;
    };
}

function UserGroupChip({ item }: Props): JSX.Element | null {
    if (item.userGroup === "All") {
        return null;
    } else {
        return (
            <Box paddingTop={2}>
                <Chip label={userGroupOptions.find((option) => option.value === item.userGroup)?.label} />
            </Box>
        );
    }
}

export { UserGroupChip };
