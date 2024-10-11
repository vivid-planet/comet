import { Box } from "@mui/material";

import { ContentScopeGrid } from "./ContentScopeGrid";
import { PermissionGrid } from "./PermissionGrid";

export const UserPermissionsPanel = ({ userId }: { userId: string }) => (
    <>
        <ContentScopeGrid userId={userId} />
        <Box sx={{ height: 20 }} />
        <PermissionGrid userId={userId} />
    </>
);
