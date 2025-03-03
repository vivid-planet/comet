import { type ComponentType } from "react";

type Settings = {
    component: ComponentType;
    type: "add" | "edit";
    titleMessage: string;
};

export const generateFormPageCode = ({ component, type, titleMessage }: Settings) => {
    const pageCode = `
        <SaveBoundary>
            <FormToolbar />
            <StackMainContent>
                <${component.name} ${type === "edit" ? "id={selectedId}" : ""} />
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
