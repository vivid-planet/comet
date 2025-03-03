type Settings = {
    importName: string;
    renderInsideStackPage: boolean;
};

export const generateGridPageCode = ({ importName, renderInsideStackPage }: Settings) => {
    const pageCode = `
        <StackToolbar>
            <ToolbarBackButton />
            <ToolbarAutomaticTitleItem />
        </StackToolbar>
        <StackMainContent fullHeight>
            <${importName} />
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
