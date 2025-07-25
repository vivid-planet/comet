import { SitePreviewProvider } from "@comet/site-nextjs";
import { theme } from "@src/theme";
import { type AppProps, type NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { IntlProvider } from "react-intl";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        -webkit-text-size-adjust: none;
        color: ${({ theme }) => theme.palette.text.primary};
        font-family: ${({ theme }) => theme.fontFamily};
        font-weight: 400;
    }
`;

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric): void {
    // https://nextjs.org/docs/advanced-features/measuring-performance#sending-results-to-analytics
    if (process.env.NEXT_PUBLIC_GTM_ID) {
        const event = {
            event: "web-vitals",
            event_category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
            event_action: name,
            event_value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
            event_label: id, // id unique to current page load
            non_interaction: true, // avoids affecting bounce rate.
        };
        window.dataLayer.push(event);
    }
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    const router = useRouter();

    return (
        // see https://github.com/vercel/next.js/tree/master/examples/with-react-intl
        // for a complete strategy to couple next with react-intl
        // defaultLocale prevents missing message warning for locale defined in code,
        // see https://github.com/formatjs/formatjs/issues/251
        <IntlProvider locale="de" defaultLocale="de">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {process.env.NEXT_PUBLIC_GTM_ID && (
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                            <!-- Google Tag Manager -->
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                            <!-- End Google Tag Manager -->`,
                        }}
                    />
                )}
            </Head>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                {router.isPreview ? (
                    <SitePreviewProvider>
                        <Component {...pageProps} />
                    </SitePreviewProvider>
                ) : (
                    <Component {...pageProps} />
                )}
            </ThemeProvider>
        </IntlProvider>
    );
}
