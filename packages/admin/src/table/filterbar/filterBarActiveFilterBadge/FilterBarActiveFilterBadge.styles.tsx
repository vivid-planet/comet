import { Theme } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/styles";

export type FilterBarActiveFilterBadgeClassKey = "hasValueCount";

export const styles = ({ palette }: Theme) => {
    return createStyles<FilterBarActiveFilterBadgeClassKey, any>({
        hasValueCount: {
            backgroundColor: palette.grey[100],
            boxSizing: "border-box",
            textAlign: "center",
            borderRadius: "4px",
            padding: "2px 5px",
            marginRight: "4px",
            fontSize: "12px",
            height: "20px",
        },
    });
};
