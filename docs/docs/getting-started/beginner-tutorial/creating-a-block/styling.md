---
title: Styling our Block
sidebar_position: 4
---

Now we will be styling our new custom block!
To do that, we are using the package [styled-components](https://styled-components.com/docs).

For this project, we are going to _overwrite_ some styles in default blocks. For one, we are resetting styling for the `TextLinkBlock`. <br/>
For another, we are changing the font size of the `HeadlineBlock` and remove its margin.

In `TextLinkBlock.tsx`, we replaced the previous link with the `StyledLink `component:

```js title="TextLinkBlock.tsx"
export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<TextLinkBlockData>) => {
        return (
            <LinkBlock data={link}>
                <StyledLink>{text}</StyledLink>
            </LinkBlock>
        );
    },
    { label: "Text link" },
);

const StyledLink = styled.a`
    text-decoration: none;
    color: #000;
`;
```

In `HeadlineBlock.tsx` in `site`, we wrapped the RichTextBlock in a styled component and added the required css:

```js title="HeadlineBlock.tsx"
export const HeadlineBlock = withPreview(
    ({ data: { headline, level } }: PropsWithData<HeadlineBlockData>) => {
        return (
            <StyledComponent>
                <RichTextBlock
                    data={headline}
                    renderers={getHeadlineRenderers(level)}
                ></RichTextBlock>
            </StyledComponent>
        );
    },
    { label: "Headline" },
);

// The new component we are wrapping the RichTextBlock with
const StyledComponent = styled.div`
    & > * {
        margin: 0;
    }

    h1 {
        font-size: 64px;
    }

    h2 {
        font-size: 48px;
    }

    h3 {
        font-size: 32px;
    }
`;
```

In `HeroBlock.tsx` in `site`, we are adding the following styled components and styles:

<!-- In the code block below, the syntax highlighting isn't working -->

```ts title="HeroBlock.tsx"
import { PropsWithData, withPreview } from "@comet/cms-site";
import { HeroBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { HeadlineBlock } from "./HeadlineBlock";
import { RichTextBlock } from "./RichTextBlock";
import { TextLinkBlock } from "./TextLinkBlock";

export const HeroBlock = withPreview(
    ({
        data: { eyebrow, headline, text, textLink, image, imageSecondary },
    }: PropsWithData<HeroBlockData>) => {
        return (
            <Container>
                <LeftContent>
                    {eyebrow}
                    <HeadlineBlock data={headline} />
                    <TextWrapper>
                        <RichTextBlock data={text} />
                    </TextWrapper>
                    <ButtonWrapper>
                        <TextLinkBlock data={textLink} />
                    </ButtonWrapper>
                </LeftContent>
                <ImageContainer>
                    <StyledDamImage1>
                        <DamImageBlock data={image} />
                    </StyledDamImage1>
                    <StyledDamImage2>
                        <DamImageBlock data={imageSecondary} />
                    </StyledDamImage2>
                </ImageContainer>
            </Container>
        );
    },
    { label: "Hero" },
);

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10vw;
    padding: 5vw 15vw;
    background-color: #050d1a;
    color: white;
`;

const ButtonWrapper = styled.div`
    background-color: #14cc33;
    display: inline-block;
    border-radius: 3px;
    text-align: center;
    padding: 10px 20px;
    color: black;
    font-size: 18px;
    margin-top: 30px;
`;

const LeftContent = styled.div`
    width: 30vw;
`;

const TextWrapper = styled.div`
    line-height: 1.8em;
    font-size: 1.4em;
`;

const ImageContainer = styled.div`
    width: 600px;
    height: 500px;
    position: relative;
`;

const StyledDamImage1 = styled.div`
    position: absolute;
    width: 350px;
    top: 0;
`;

const StyledDamImage2 = styled.div`
    position: absolute;
    width: 350px;
    right: 75px;
    top: 100px;
    bottom: 0;
    z-index: 1;
`;
```



<!-- Oh wait, we fortgot to add X! In order to keep our content and make the old version of the block compatible with the new version, we need to write a [migration](https://docs.comet-dxp.com/docs/blocks/block-migrations).

Let's get started! -->

