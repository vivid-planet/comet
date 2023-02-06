import * as React from "react";

import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { DamTable } from "./DamTable";

type Props = {
    path: string;
};

function DamPage({ path }: Props): React.ReactElement {
    useContentScopeConfig({ redirectPathAfterChange: path });

    return <DamTable />;
}

export { DamPage };
