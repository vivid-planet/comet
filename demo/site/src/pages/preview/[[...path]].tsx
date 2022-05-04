import { parsePreviewState, PreviewPage } from "@comet/cms-site";
import { defaultLanguage } from "@src/config";
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
    const { params, query, locale } = context;
    const { includeInvisibleContent } = parsePreviewState(query);
    const getUniversalProps = createGetUniversalProps({ language: locale ?? defaultLanguage, includeInvisibleContent, previewDamUrls: true });
    return await getUniversalProps({ params });
};
