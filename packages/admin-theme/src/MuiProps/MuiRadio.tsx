import { RadioChecked, RadioUnchecked } from "@comet/admin-icons";
import { RadioProps } from "@material-ui/core/Radio";
import * as React from "react";

export const getMuiRadioProps = (): RadioProps => ({
    color: "primary",
    icon: <RadioUnchecked />,
    checkedIcon: <RadioChecked />,
});
