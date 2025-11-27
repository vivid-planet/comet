import { DataGrid as MuiDataGrid, type DataGridProps } from "@mui/x-data-grid";
import { type FC, useEffect, useState } from "react";

export const DataGrid: FC<DataGridProps> = (props) => {
    const [Component, setComponent] = useState<FC<DataGridProps>>(MuiDataGrid);

    useEffect(() => {
        let isMounted = true;
        import("@mui/x-data-grid-premium")
            .then((module) => {
                if (isMounted && module.DataGridPremium) {
                    setComponent(() => module.DataGridPremium as unknown as FC<DataGridProps>);
                }
            })
            .catch(() => {
                import("@mui/x-data-grid-pro")
                    .then((module) => {
                        if (isMounted && module.DataGridPro) {
                            setComponent(() => module.DataGridPro as unknown as FC<DataGridProps>);
                        }
                    })
                    .catch(() => {});
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return <Component {...props} />;
};
