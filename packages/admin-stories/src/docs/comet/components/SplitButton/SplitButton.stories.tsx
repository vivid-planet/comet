import { SplitButton } from "@comet/admin";
import { Home } from "@comet/admin-icons";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/splitbutton", module)
    .add("Uncontrolled SplitButton", () => {
        return (
            <SplitButton variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Secondary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Controlled SplitButton", () => {
        const [selectedIndex, setSelectedIndex] = React.useState(1);
        return (
            <SplitButton
                variant={"contained"}
                color={"secondary"}
                selectedIndex={selectedIndex}
                onSelectIndex={(index: number) => {
                    setSelectedIndex(index);
                }}
            >
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Secondary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Local Storage Index", () => {
        return (
            <SplitButton variant={"contained"} color={"secondary"} localStorageKey={"StorylocalStorageIndexSplitButton"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Local Storage - Primary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Local Storage - Secondary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("tertiary clicked");
                    }}
                >
                    Local Storage - Tertiary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Session Storage Index", () => {
        return (
            <SplitButton
                localStorageKey={"StorySessionStorageIndexSplitButton"}
                storage={window.sessionStorage}
                variant={"contained"}
                color={"secondary"}
            >
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Session Storage - Primary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Session Storage - Secondary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("tertiary clicked");
                    }}
                >
                    Session Storage - Tertiary Action
                </Button>
            </SplitButton>
        );
    })
    .add("One child", () => {
        return (
            <SplitButton variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    })
    .add("One child with select", () => {
        return (
            <SplitButton showSelectButton={true} variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    })
    .add("One child disabled", () => {
        return (
            <SplitButton disabled={true} variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Color change", () => {
        return (
            <SplitButton variant={"contained"}>
                <Button
                    color={"primary"}
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    color={"secondary"}
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Secondary Action
                </Button>
                <Button
                    onClick={() => {
                        alert("tertiary clicked");
                    }}
                >
                    Tertiary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Variant change", () => {
        return (
            <SplitButton color={"primary"}>
                <Button
                    variant={"contained"}
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    variant={"outlined"}
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Secondary Action
                </Button>
                <Button
                    variant={"text"}
                    onClick={() => {
                        alert("tertiary clicked");
                    }}
                >
                    Tertiary Action
                </Button>
            </SplitButton>
        );
    })
    .add("Custom Component", () => {
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
