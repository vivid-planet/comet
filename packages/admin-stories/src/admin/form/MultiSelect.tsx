import { Field, FinalFormMultiSelect } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { Box, Card, CardContent, Collapse, FormLabel, Popover } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    const colorOptions = [
        { value: "red", label: "Red", icon: <div style={{ width: 20, height: 20, backgroundColor: "red" }} /> },
        { value: "green", label: "Green", icon: <div style={{ width: 20, height: 20, backgroundColor: "green" }} /> },
        { value: "blue", label: "Blue", icon: <div style={{ width: 20, height: 20, backgroundColor: "blue" }} /> },
    ];

    const [open, setOpen] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const openPopover = Boolean(anchorEl);
    return (
        <div>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Box style={{ display: "flex", gap: "15px" }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormLabel>MultiSelect in Collapse</FormLabel>
                                    <Box
                                        onClick={() => setOpen(!open)}
                                        style={{
                                            minWidth: "100px",
                                            minHeight: "38px",
                                            border: "1px solid #D9D9D9",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            display: "flex",
                                            padding: "9px 32px 9px 9px",
                                            boxSizing: "border-box",
                                            position: "relative",
                                            borderRadius: "2px",
                                            marginBottom: "2px",
                                        }}
                                    >
                                        <Box style={{ lineHeight: "20px" }}>
                                            {values.multiSelectCollapse && values.multiSelectCollapse.map((value: string) => `${value}, `)}
                                        </Box>
                                        <Box
                                            style={{
                                                position: "absolute",
                                                right: "13px",
                                                top: "13px",
                                                width: "12px",
                                                height: "12px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            <ChevronDown fontSize={"inherit"} />
                                        </Box>
                                    </Box>
                                    <Collapse in={open} style={{ border: "1px solid #D9D9D9", borderRadius: "2px" }}>
                                        <Field name="multiSelectCollapse" fullWidth component={FinalFormMultiSelect} options={options} />
                                    </Collapse>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormLabel>MultiSelect in Popup</FormLabel>
                                    <Box
                                        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                            setAnchorEl(event.currentTarget);
                                        }}
                                        style={{
                                            minWidth: "100px",
                                            minHeight: "38px",
                                            border: "1px solid #D9D9D9",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            display: "flex",
                                            padding: "9px 32px 9px 9px",
                                            boxSizing: "border-box",
                                            position: "relative",
                                            borderRadius: "2px",
                                            marginBottom: "2px",
                                        }}
                                    >
                                        <Box style={{ lineHeight: "20px" }}>
                                            {values.multiSelectPopover && values.multiSelectPopover.map((value: string) => `${value}, `)}
                                        </Box>
                                        <Box
                                            style={{
                                                position: "absolute",
                                                right: "13px",
                                                top: "13px",
                                                width: "12px",
                                                height: "12px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            <ChevronDown fontSize={"inherit"} />
                                        </Box>
                                    </Box>
                                    <Popover
                                        anchorEl={anchorEl}
                                        open={openPopover}
                                        style={{ border: "1px solid #D9D9D9", borderRadius: "2px" }}
                                        onClose={() => {
                                            setAnchorEl(null);
                                        }}
                                        PaperProps={{ square: true, elevation: 1 }}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                    >
                                        <Box width={200}>
                                            <Field name="multiSelectPopover" fullWidth component={FinalFormMultiSelect} options={options} />
                                        </Box>
                                    </Popover>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormLabel>MultiSelect with ColorIcon</FormLabel>
                                    <Box width={200}>
                                        <Field name="multiSelectWithColorIcon" fullWidth component={FinalFormMultiSelect} options={colorOptions} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("MultiSelect", () => <Story />);
