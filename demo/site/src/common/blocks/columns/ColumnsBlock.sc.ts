import { styled } from "@pigment-css/react";

//const Root = layout === "one-column" ? OneColumnRoot : TwoColumnRoot;
interface RootStyleProps {
    layout: "one-column" | "two-column" | string;
}
export const Root = styled("div")<RootStyleProps>({
    variants: [
        {
            props: {
                layout: "one-column",
            },
            style: {
                padding: "0 40px",
            },
        },
        {
            props: {
                layout: "two-columns" /* 10 - 10*/,
            },
            style: {
                display: "grid",
                gridTemplateColumns: "10fr 10fr",
                columnGap: "40px",
            },
        },
        {
            props: {
                layout: "two-columns-12-6",
            },
            style: {
                display: "grid",
                gridTemplateColumns: "12fr 6fr",
                columnGap: "40px",
            },
        },
    ],
});
