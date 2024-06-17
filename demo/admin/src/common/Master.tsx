import { MasterLayout } from "@comet/admin";
import { MasterMenu, MasterMenuRoutes } from "@comet/cms-admin";
import * as React from "react";

import MasterHeader from "./MasterHeader";
import { masterMenuData } from "./MasterMenu";

export const Master: React.FC = () => (
    <MasterLayout headerComponent={MasterHeader} menuComponent={() => <MasterMenu menu={masterMenuData} />}>
        <MasterMenuRoutes menu={masterMenuData} />
    </MasterLayout>
);
