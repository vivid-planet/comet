import { makeStyles, Theme, Typography } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface StyleProps {
    fieldBarWidth: number;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        showMoreWrapper: {
            minWidth: (props: StyleProps) => `${props.fieldBarWidth}px`,
            border: `1px solid ${theme.palette.grey[300]}`,
            justifyContent: "center",
            position: "relative",
            marginBottom: "10px",
            alignItems: "center",
            marginRight: "10px",
            cursor: "pointer",
            display: "flex",
        },
        showMoreTextWrapper: {
            marginLeft: "15px",
        },
    }),
    { name: "CometAdminFilterBar" },
);

export interface FilterBarMoreFilterButtonProps {
    fieldBarWidth: number;
}

export function FilterBarMoreFilterButton({ fieldBarWidth, children }: React.PropsWithChildren<FilterBarMoreFilterButtonProps>) {
    const [hasExtended, setHasExtended] = React.useState(false);
    const classes = useStyles({ fieldBarWidth: fieldBarWidth });
    if (!hasExtended) {
        return (
            <div className={classes.showMoreWrapper} style={{ minWidth: fieldBarWidth }} onClick={() => setHasExtended(true)}>
                <MoreHoriz />
                <div className={classes.showMoreTextWrapper}>
                    <Typography variant="subtitle2">
                        <FormattedMessage id="cometAdmin.generic.moreFilter" defaultMessage="More Filter" />
                    </Typography>
                </div>
            </div>
        );
    } else {
        return <>{children}</>;
    }
}
