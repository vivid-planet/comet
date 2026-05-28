import { DataGrid, type GridSlotsComponent } from "@mui/x-data-grid";
import type { Meta, StoryFn } from "@storybook/react-vite";

import { ActionGridToolbar } from "../ActionGridToolbar";

type Story = StoryFn<typeof ActionGridToolbar>;
const config: Meta<typeof ActionGridToolbar> = {
    component: ActionGridToolbar,
    title: "actionLog/actionLogGrid/actionGridToolbar/ActionGridToolbar",
};
export default config;

const TemplateStory: Story = (props) => {
    const StoryComponent = () => {
        return (
            <DataGrid
                columns={[]}
                rows={[]}
                showToolbar
                slotProps={{
                    toolbar: props,
                }}
                slots={{
                    toolbar: ActionGridToolbar as GridSlotsComponent["toolbar"],
                }}
            />
        );
    };

    return <StoryComponent />;
};

export const Default: Story = TemplateStory.bind({}) as Story;
export const DisabledCompare: Story = TemplateStory.bind({}) as Story;
DisabledCompare.args = {
    disableCompare: true,
};
