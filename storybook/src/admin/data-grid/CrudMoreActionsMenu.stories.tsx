import { CrudMoreActionsMenu, CrudMoreActionsMenuItem } from "@comet/admin";
import { Delete, Download, Excel, Favorite, Move } from "@comet/admin-icons";
import { ListItemIcon } from "@mui/material";

export default {
    title: "@comet/admin/data-grid/CrudMoreActionsMenu",
};

export const Basic = () => {
    return (
        <CrudMoreActionsMenu
            selectionSize={2}
            overallActions={[
                {
                    label: "Export to Excel",
                    onClick: () => {},
                    icon: <Excel />,
                },
            ]}
            selectiveActions={[
                {
                    label: "Move",
                    onClick: () => {},
                    icon: <Move />,
                },
                {
                    label: "Delete",
                    onClick: () => {},
                    icon: <Delete />,
                    divider: true,
                },
                {
                    label: "Download",
                    onClick: () => {},
                    icon: <Download />,
                },
            ]}
        />
    );
};

export const CustomComponent = () => {
    const CustomAction = () => {
        return (
            <CrudMoreActionsMenuItem
                onClick={() => {
                    window.alert("Hello from custom action");
                }}
            >
                <ListItemIcon>
                    <Favorite />
                </ListItemIcon>
                Custom Action
            </CrudMoreActionsMenuItem>
        );
    };

    return (
        <CrudMoreActionsMenu
            overallActions={[
                {
                    label: "Export to Excel",
                    onClick: () => {},
                    icon: <Excel />,
                },
                <CustomAction key="custom-action" />,
            ]}
        />
    );
};
