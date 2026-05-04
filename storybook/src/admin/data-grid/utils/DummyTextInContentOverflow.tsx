import { ContentOverflow } from "@comet/admin";
import { Typography } from "@mui/material";

export const DummyTextInContentOverflow = () => {
    const paragraphsCount = 5;
    return (
        <ContentOverflow>
            <Typography fontWeight={600} gutterBottom>
                Ornare Inceptos Egestas Bibendum
            </Typography>
            {Array.from({ length: paragraphsCount }).map((_, index) => (
                <Typography key={index} variant="body2" gutterBottom={index !== paragraphsCount - 1}>
                    Curabitur blandit tempus porttitor. Nullam id dolor id nibh ultricies vehicula ut id elit. Cras mattis consectetur purus sit amet
                    fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </Typography>
            ))}
        </ContentOverflow>
    );
};
