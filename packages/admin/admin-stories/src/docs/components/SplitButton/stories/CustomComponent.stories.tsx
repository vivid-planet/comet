import { SplitButton } from "@comet/admin";
import { Home } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Custom Component", module).add("Custom Component", () => {
    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <SplitButton>
                    <div
                        style={{ cursor: "pointer", borderBottomLeftRadius: 20, borderTopLeftRadius: 20, background: "orangered", padding: 10 }}
                        onClick={() => {
                            alert("Pressed");
                        }}
                    >
                        <Typography color={"initial"}>
                            <Home /> Home
                        </Typography>
                    </div>
                    <Button variant={"contained"} color={"primary"}>
                        Primary Action
                    </Button>
                </SplitButton>
            </div>
            <div>
                <SplitButton>
                    <div
                        style={{ cursor: "pointer", background: "teal", padding: 10 }}
                        onClick={() => {
                            alert("Pressed");
                        }}
                    >
                        <Typography color={"initial"}>
                            <Home /> Home
                        </Typography>
                    </div>
                    <Button variant={"contained"} color={"primary"}>
                        Primary Action
                    </Button>
                </SplitButton>
            </div>
        </div>
    );
});
