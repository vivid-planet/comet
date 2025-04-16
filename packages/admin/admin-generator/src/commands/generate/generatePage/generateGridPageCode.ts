import { type ComponentType } from "react";

type Settings = {
    component: ComponentType;
    renderInsideStackPage: boolean;
};

export const generateGridPageCode = ({ component, renderInsideStackPage }: Settings) => {
    const pageCode = `
        <StackToolbar>
            <ToolbarBackButton />
            <ToolbarAutomaticTitleItem />
        </StackToolbar>
        <StackMainContent fullHeight>
            <${component.name} />
        </StackMainContent>
    `;

    if (renderInsideStackPage) {
        return `
            <StackPage name="grid">
                ${pageCode}
            </StackPage>`;
    }

    return pageCode;
};
