import { DataGrid as MuiDataGrid, type DataGridProps } from "@mui/x-data-grid";
import { type FC, useEffect, useState } from "react";

export const DataGrid: FC<DataGridProps> = (props) => {
    const [ProComponent, setProComponent] = useState<null | FC<DataGridProps>>(null);
    const [PremiumComponent, setPremiumComponent] = useState<null | FC<DataGridProps>>(null);

    useEffect(() => {
        let isMounted = true;
        import("@mui/x-data-grid-premium")
            .then((module) => {
                if (isMounted && module.DataGridPremium) {
                    setPremiumComponent(() => module.DataGridPremium as unknown as FC<DataGridProps>);
                }
            })
            .catch(() => {
                setPremiumComponent(null);
                import("@mui/x-data-grid-pro")
                    .then((module) => {
                        if (isMounted && module.DataGridPro) {
                            setProComponent(() => module.DataGridPro as unknown as FC<DataGridProps>);
                        }
                    })
                    .catch(() => {
                        setProComponent(null);
                    });
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (PremiumComponent) {
        return <PremiumComponent {...props} />;
    }
    if (ProComponent) {
        return <ProComponent {...props} />;
    }
    return <MuiDataGrid {...props} />;
};
