"use client";
import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import { IntlProvider } from "@src/app/[lang]/IntlProvider";
import { FormBuilderBlock } from "@src/form-builder/blocks/FormBuilderBlock";

// TODO: Fix intlProvider
const PreviewPage: React.FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();

    return (
        <div>
            <IntlProvider locale="en" messages={{}}>
                {iFrameBridge.block && (
                    <FormBuilderBlock
                        data={iFrameBridge.block}
                        submitButtonText={iFrameBridge.block.submitButtonText}
                        formId={iFrameBridge.block.id}
                    />
                )}
            </IntlProvider>
        </div>
    );
};
const IFrameBridgePreviewPage = () => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <PreviewPage />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};

export default IFrameBridgePreviewPage;
