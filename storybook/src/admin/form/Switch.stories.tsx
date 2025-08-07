import { SwitchField } from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin/form",
};

export const Switch = () => {
    return (
        <div style={{ width: 500 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Card variant="outlined">
                            <CardContent>
                                <SwitchField fullWidth name="simpleSwitch" fieldLabel="Simple switch" label="With label on the right" />
                                <SwitchField
                                    fullWidth
                                    name="dynamicLabel"
                                    fieldLabel="Switch with dynamic label"
                                    label={(checked) => (checked ? "Yes" : "No")}
                                />
                                <SwitchField fullWidth name="disabled" fieldLabel="Disabled switch" label="Disabled" disabled />
                            </CardContent>
                        </Card>
                    </form>
                )}
            />
        </div>
    );
};
