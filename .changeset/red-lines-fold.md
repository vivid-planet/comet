---
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add an overridable `PlayPauseButton` to all video blocks to enable pausing videos without controls and export its types `PlayPauseButtonProps`

To add custom styling to the button, a custom component can be passed to the video blocks, for example:

```tsx
    const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean): SupportedBlocks => {
    ...
    return {
        damVideo: (data) => (
            <DamVideoBlock
                data={data}
                previewImageSizes={sizes}
                aspectRatio={aspectRatio}
                fill={fill}
                renderPlayPauseButton={(props) => <PlayPauseButton {...props} />}
            />
        ),
    };
```

The custom button component needs to accept `PlayPauseButtonProps` to guarantee its functionality.
