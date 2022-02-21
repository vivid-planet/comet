import {
    CancelButton,
    Field,
    FieldContainer,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormRadio,
    FinalFormSelect,
    FormSection,
    OkayButton,
} from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    styled,
    Theme,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const fooBarOptions = [
    { value: "foo", label: "Foo" },
    { value: "bar", label: "Bar" },
];

const flavourOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

storiesOf("stories/form/Layout", module)
    .add("Fields in sidebar", () => {
        const Root = styled("div")`
            display: flex;
            align-items: stretch;
            justify-content: stretch;
        `;

        const Content = withStyles({
            root: {
                flexGrow: 1,
                marginRight: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        })(Paper);

        const ContentText = withStyles({
            root: {
                fontSize: 54,
                opacity: 0.25,
            },
        })(Typography);

        const Sidebar = styled("div")`
            max-width: 350px;
            flex-grow: 1;
        `;

        return (
            <Root>
                <Content>
                    <ContentText>Content</ContentText>
                </Content>
                <Sidebar>
                    <Form
                        onSubmit={() => {}}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <FormSection title="Sidebar example first section">
                                    <Field name="text1" label="Text 1" fullWidth component={FinalFormInput} />
                                    <Field name="select" label="Select" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props}>
                                                {flavourOptions.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>
                                </FormSection>
                                <FormSection title="Second section">
                                    <Field name="text3" label="Text 3" fullWidth component={FinalFormInput} />
                                    <Field
                                        name="textMultiline"
                                        label="Text (multiline)"
                                        multiline
                                        minRows={3}
                                        maxRows={5}
                                        fullWidth
                                        component={FinalFormInput}
                                    />
                                    <Field name="checkbox" type="checkbox" fullWidth>
                                        {(props) => <FormControlLabel label="Checkbox" control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <FieldContainer label="Radio" fullWidth>
                                        <>
                                            {flavourOptions.map(({ value, label }) => (
                                                <Field key={value} name="radio" type="radio" value={value} variant="vertical">
                                                    {(props) => <FormControlLabel label={label} control={<FinalFormRadio {...props} />} />}
                                                </Field>
                                            ))}
                                        </>
                                    </FieldContainer>
                                </FormSection>
                            </form>
                        )}
                    />
                </Sidebar>
            </Root>
        );
    })
    .add("Fields in dialog", () => {
        const [showDialog, setShowDialog] = React.useState<boolean>(false);

        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                    <Form
                        onSubmit={() => {
                            setShowDialog(false);
                        }}
                        render={({ handleSubmit }) => (
                            <>
                                <DialogTitle>Full-width fields inside a dialog</DialogTitle>
                                <DialogContent>
                                    <form onSubmit={handleSubmit}>
                                        <Field name="select" label="Select" fullWidth>
                                            {(props) => (
                                                <FinalFormSelect {...props} fullWidth>
                                                    {flavourOptions.map((option) => (
                                                        <MenuItem value={option.value} key={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </FinalFormSelect>
                                            )}
                                        </Field>
                                        <Field name="text" label="Text" fullWidth component={FinalFormInput} />
                                        <Field
                                            name="textMultiline"
                                            label="Text (multiline)"
                                            multiline
                                            minRows={3}
                                            maxRows={5}
                                            fullWidth
                                            component={FinalFormInput}
                                        />
                                        <Field name="checkbox" type="checkbox" fullWidth>
                                            {(props) => <FormControlLabel label="Checkbox" control={<FinalFormCheckbox {...props} />} />}
                                        </Field>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <CancelButton onClick={() => setShowDialog(false)} />
                                    <OkayButton onClick={handleSubmit} />
                                </DialogActions>
                            </>
                        )}
                    />
                </Dialog>

                <div style={{ textAlign: "center" }}>
                    <Button variant="contained" color="primary" onClick={() => setShowDialog(true)}>
                        Show Dialog
                    </Button>
                </div>
            </>
        );
    })
    .add("Inline fields", () => {
        return (
            <Form
                onSubmit={() => {}}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="select1" label="Select 1" width={400}>
                            {(props) => (
                                <FinalFormSelect {...props}>
                                    {fooBarOptions.map((option) => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </FinalFormSelect>
                            )}
                        </Field>
                        <Field name="select2" label="Select 2">
                            {(props) => (
                                <FinalFormSelect {...props}>
                                    {flavourOptions.map((option) => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </FinalFormSelect>
                            )}
                        </Field>
                        <Field name="text1" label="Text 1" component={FinalFormInput} />
                        <Field name="text2" label="Text 2" component={FinalFormInput} />
                    </form>
                )}
            />
        );
    })
    .add("Grid layout", () => {
        return (
            <Form
                onSubmit={() => {}}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={3}>
                                <Field name="select1" label="Select 1" fullWidth>
                                    {(props) => (
                                        <FinalFormSelect {...props}>
                                            {fooBarOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={3}>
                                <Field name="select2" label="Select 2" fullWidth>
                                    {(props) => (
                                        <FinalFormSelect {...props}>
                                            {flavourOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={3}>
                                <Field name="text1" label="Text 1" component={FinalFormInput} fullWidth />
                            </Grid>
                            <Grid item xs={3}>
                                <Field name="text2" label="Text 2" component={FinalFormInput} fullWidth />
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        );
    })
    .add("Horizontal fields", () => {
        const theme = createCometTheme({
            components: {
                // @ts-ignore - TODO: Fix this
                CometAdminFormFieldContainer: {
                    defaultProps: {
                        variant: "horizontal",
                    },
                },
            },
        });

        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Form
                        onSubmit={() => {}}
                        initialValues={{ select: "none" }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="select" label="Select">
                                    {(props) => (
                                        <FinalFormSelect {...props}>
                                            <MenuItem value="none">No value</MenuItem>
                                            {flavourOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                                <Field name="text" label="Text" component={FinalFormInput} fullWidth />
                                <Field name="Multiline" label="Multiline" multiline minRows={3} maxRows={5} component={FinalFormInput} fullWidth />
                                <FieldContainer label="Radio" fullWidth>
                                    <>
                                        {flavourOptions.map(({ value, label }) => (
                                            <Field key={value} name="radio" type="radio" value={value} variant="vertical">
                                                {(props) => <FormControlLabel label={label} control={<FinalFormRadio {...props} />} />}
                                            </Field>
                                        ))}
                                    </>
                                </FieldContainer>
                                <Field name="checkbox" type="checkbox" label="Checkbox">
                                    {(props) => <FormControlLabel label="" control={<FinalFormCheckbox {...props} />} />}
                                </Field>
                            </form>
                        )}
                    />
                </ThemeProvider>
            </StyledEngineProvider>
        );
    });
