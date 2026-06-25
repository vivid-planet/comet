import { SvgUse } from "@src/common/helpers/SvgUse";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./ChooseButton.module.scss";

type ChooseButtonProps = {
    label?: ReactNode;
    onClick: () => void;
};

export const ChooseButton = ({ label, onClick }: ChooseButtonProps) => (
    <button type="button" className={styles.chooseButton} onClick={onClick}>
        <SvgUse href="/assets/icons/add-file.svg#root" width={16} height={16} />
        {label ?? <FormattedMessage id="fileUploadField.chooseFiles" defaultMessage="Choose files" />}
    </button>
);
