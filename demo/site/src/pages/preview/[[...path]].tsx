import { parsePreviewState, PreviewPage } from "@comet/cms-site";
import Page, { createGetUniversalProps, PageUniversalProps } from "@src/pages/[[...path]]";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";

export default function AuthenticatedPreviewPage(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    return (
        <PreviewPage>
            <Page {...props} />
        </PreviewPage>
    );
}

export const getServerSideProps: GetServerSideProps<PageUniversalProps> = async (context: GetServerSidePropsContext) => {
    const { includeInvisibleBlocks } = parsePreviewState(context.query);
    const getUniversalProps = createGetUniversalProps({
        includeInvisiblePages: true,
        includeInvisibleBlocks,
        previewDamUrls: true,
    });
    return getUniversalProps(context);
};
