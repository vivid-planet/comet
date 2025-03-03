type Settings = {
    importName: string;
    type: "add" | "edit";
    titleMessage: string;
};

export const generateFormPageCode = ({ importName, type, titleMessage }: Settings) => {
    const pageCode = `
        <SaveBoundary>
            <FormToolbar />
            <StackMainContent>
                <${importName} ${type === "edit" ? "id={selectedId}" : ""} />
            </StackMainContent>
        </SaveBoundary>`;

    const editPageCode = `{(selectedId) => (
        ${pageCode}
    )}`;

    return `
        <StackPage name="${type}" title={${titleMessage}}>
            ${type === "edit" ? editPageCode : pageCode}
        </StackPage>`;
};
