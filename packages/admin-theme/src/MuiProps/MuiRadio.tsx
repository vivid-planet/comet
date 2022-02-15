import { RadioChecked, RadioUnchecked } from "@comet/admin-icons";
import { RadioProps } from "@mui/material/Radio";
import * as React from "react";

export const getMuiRadioProps = (): RadioProps => ({
    color: "primary",
    icon: <RadioUnchecked />,
    checkedIcon: <RadioChecked />,
});
