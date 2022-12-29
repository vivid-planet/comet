import * as React from "react";

import { DamTable } from "./DamTable";
import { MoveDamItemDialog } from "./DataGrid/moveDialog/MoveDamItemDialog";
function DamPage(): React.ReactElement {
    return (
        <>
            <DamTable />
            <MoveDamItemDialog
                open={true}
                onClose={() => {
                    console.log("close");
                }}
                onChooseFolder={(folderId) => {
                    console.log("chosen folder ", folderId);
                }}
                numSelectedItems={2}
            />
        </>
    );
}

export { DamPage };
