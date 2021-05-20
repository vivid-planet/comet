import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    FinalFormRangeInput,
    FinalFormSwitch,
    TableFilterFinalForm,
} from "@comet/admin";
import { Toolbar, ToolbarItem, ToolbarTitleItem, useTableQueryFilter } from "@comet/admin";
import { Box, Divider, FormControlLabel, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";
storiesOf("stories/components/Toolbar/Filterbar", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Filterbar", () => {
        const filterApi = useTableQueryFilter({});

        return (
            <Toolbar>
                <ToolbarTitleItem>Filterbar</ToolbarTitleItem>
                <ToolbarItem>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <FilterBar>
                            <FilterBarPopoverFilter label={"Brand"}>
                                <Field name="brand" type="text" component={FinalFormInput} fullWidth />
                            </FilterBarPopoverFilter>
                            <FilterBarPopoverFilter label={"Model"}>
                                <Field name="model" type="text" component={FinalFormInput} fullWidth />
                            </FilterBarPopoverFilter>
                            <FilterBarPopoverFilter label={"Owner"}>
                                <Field label={"Firstname:"} name="owner.firstname" type="text" component={FinalFormInput} fullWidth />
                                <Field label={"Lastname:"} name="owner.lastname" type="text" component={FinalFormInput} fullWidth />
                            </FilterBarPopoverFilter>
                            <FilterBarMoreFilters>
                                <FilterBarPopoverFilter label={"Horsepower"}>
                                    <Field name="horsepower" component={FinalFormRangeInput} fullWidth min={50} max={200} />
                                </FilterBarPopoverFilter>
                                <FilterBarPopoverFilter label={"Price"}>
                                    <Box maxWidth={350}>
                                        <Field name="price" component={FinalFormRangeInput} startAdornment={"€"} fullWidth min={50} max={1000} />
                                        <Divider />
                                        <Field name="expressDelivery" type="checkbox" fullWidth>
                                            {(props) => <FormControlLabel label={"Express delivery"} control={<FinalFormSwitch {...props} />} />}
                                        </Field>
                                        <Box paddingBottom={4} paddingLeft={4} paddingRight={4}>
                                            <Typography variant={"body2"}>
                                                Show all articles that can be shipped with express delivery (usually shipped within 2-3 work days)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </FilterBarPopoverFilter>
                            </FilterBarMoreFilters>
                        </FilterBar>
                    </TableFilterFinalForm>
                </ToolbarItem>
            </Toolbar>
        );
    });
