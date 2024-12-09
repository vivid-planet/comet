import { FormSection } from "@comet/admin";
import { ReactSelect } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry", isDisabled: true },
    { value: "vanilla", label: "Vanilla" },
];

export default {
    title: "@comet/admin-react-select",
};

export const ReactSelectDisabledOption = () => {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="React Select Disabled Option" disableMarginBottom>
                    <ReactSelect options={options} />
                </FormSection>
            </CardContent>
        </Card>
    );
};
