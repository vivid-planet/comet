import { Toolbar, ToolbarItem } from "@comet/admin";
import { Search } from "@comet/admin-icons";
import { InputAdornment, InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Search Autocomplete", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Search Autocomplete", () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Autocomplete
                        popupIcon={null}
                        options={[
                            { name: "Jesse Schmuck" },
                            { name: "Karie Berkman" },
                            { name: "Nena Holliman" },
                            { name: "Gustavo Snay" },
                            { name: "Jaime Santerre" },
                            { name: "Eilene Villanuev" },
                            { name: "Bernetta Kam" },
                            { name: "Amiee Galley" },
                            { name: "Sergio Dement" },
                            { name: "Lily Bellini" },
                            { name: "Isidra Wolff" },
                            { name: "Rex Mikell" },
                            { name: "Stacey Minard" },
                            { name: "Nikia Julien" },
                            { name: "Delbert Worman" },
                            { name: "Essie Delsignor" },
                            { name: "Page Vieira" },
                            { name: "Tamiko Livers" },
                            { name: "Tianna Sheeler" },
                        ]}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 350 }}
                        renderInput={({ InputProps, ...restParams }) => (
                            <InputBase
                                {...restParams}
                                {...InputProps}
                                placeholder={"Search"}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                            />
                        )}
                    />
                </ToolbarItem>
            </Toolbar>
        );
    });
