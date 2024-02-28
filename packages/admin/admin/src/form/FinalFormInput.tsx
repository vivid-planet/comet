import { ArtificialIntelligence, Translate } from "@comet/admin-icons";
import { Button, IconButton, InputBase, InputBaseProps, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { FieldInputProps, FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { Loading } from "../common/Loading";
import { useContentGenerationService } from "../contentGeneration/useContentGenerationService";
import { useContentTranslationService } from "../translator/useContentTranslationService";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        contentGenerationButton?: (input: FieldInputProps<string, HTMLInputElement | HTMLTextAreaElement>) => void;
        loading?: boolean;
        disableContentTranslation?: boolean;
    };

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    contentGenerationButton,
    loading,
    disableContentTranslation,

    ...props
}: FinalFormInputProps): React.ReactElement {
    const theme = useTheme();
    const { enabled, translate } = useContentTranslationService();
    const { enabled: ContentGenerationEnabled } = useContentGenerationService();

    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {contentGenerationButton && ContentGenerationEnabled && (
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={() => contentGenerationButton(input)}>
                            {loading ? <Loading behavior="fillParent" fontSize="large" /> : <ArtificialIntelligence />}
                        </IconButton>
                    )}
                    {enabled && !disableContentTranslation && (
                        <Tooltip title={<FormattedMessage id="comet.translate" defaultMessage="Translate" />}>
                            <Button onClick={async () => input.onChange(await translate(input.value))}>
                                <Translate />
                            </Button>
                        </Tooltip>
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
