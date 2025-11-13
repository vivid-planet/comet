import { createCometTheme, FieldContainer, MuiThemeProvider } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { InputBase, MenuItem, Select, type SelectChangeEvent, Stack, ThemeProvider } from "@mui/material";
import { useState } from "react";

export default {
    title: "@comet/admin/SelectDebug",
};

export const Default = {
    render: () => {
        const [selectedVariant, setSelectedVariant] = useState<string>("primary");

        const theme = createCometTheme({
            components: {
                MuiSelect: {
                    defaultProps: {
                        input: <InputBase />,
                        IconComponent: ChevronDown,
                    },
                },
            },
        });

        const hanleChange = (event: SelectChangeEvent<string>) => {
            setSelectedVariant(event.target.value);
        };

        return (
            <Stack spacing={10}>
                <FieldContainer label="Standard Usage (should work but looks broken)">
                    <Select value={selectedVariant} onChange={hanleChange}>
                        <MenuItem value="primary">Primary</MenuItem>
                        <MenuItem value="secondary">Secondary</MenuItem>
                    </Select>
                </FieldContainer>

                <FieldContainer label="Fixed Usage using props directly">
                    <Select input={<InputBase />} IconComponent={ChevronDown} value={selectedVariant} onChange={hanleChange}>
                        <MenuItem value="primary">Primary</MenuItem>
                        <MenuItem value="secondary">Secondary</MenuItem>
                    </Select>
                </FieldContainer>

                <MuiThemeProvider theme={theme}>
                    <FieldContainer label="Using ThemeProvider from Comet (should work, is used in all projects in App.tsx)">
                        <Select value={selectedVariant} onChange={hanleChange}>
                            <MenuItem value="primary">Primary</MenuItem>
                            <MenuItem value="secondary">Secondary</MenuItem>
                        </Select>
                    </FieldContainer>
                </MuiThemeProvider>

                <ThemeProvider theme={theme}>
                    <FieldContainer label="Using ThemeProvider from MUI (works but should not be necessary)">
                        <Select value={selectedVariant} onChange={hanleChange}>
                            <MenuItem value="primary">Primary</MenuItem>
                            <MenuItem value="secondary">Secondary</MenuItem>
                        </Select>
                    </FieldContainer>
                </ThemeProvider>
            </Stack>
        );
    },
};
