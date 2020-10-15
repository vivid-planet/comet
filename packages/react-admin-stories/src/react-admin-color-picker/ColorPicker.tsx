import { storiesOf } from "@storybook/react";
import { ColorPicker } from "@vivid-planet/react-admin-color-picker";
import { Field } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => (
    <div style={{ width: "500px" }}>
        <Form
            onSubmit={(values) => {
                // do nothing
            }}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: "10px"}}>
                        <Field name="colorPicker" label="Color-Picker" type="text" component={() => <ColorPicker showPicker initialColor={"magenta"}/>} fullWidth />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                    <Field
                        name="colorPalette"
                        label="Color-Palette"
                        type="text"
                        component={() => <ColorPicker colorPalette={["red", "green", "magenta", "pink", "yellow", "brown"]} />}
                        fullWidth
                    />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                    <Field
                        name="colorPickerPalette"
                        label="Color-Palette &amp; Picker"
                        type="text"
                        component={() => <ColorPicker initialColor={"navy"} showPicker colorPalette={["red", "green", "magenta", "pink", "yellow", "brown"]} />}
                        fullWidth
                    />
                    </div>
                </form>
            )}
        />
    </div>
);

storiesOf("react-admin-color-picker", module).add("Color Picker", () => <Story />);
