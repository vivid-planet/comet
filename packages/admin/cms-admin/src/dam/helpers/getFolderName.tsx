import { IntlShape } from "react-intl";

export function getFolderName(folder: { name: string; isSharedBetweenAllScopes: boolean }, { intl }: { intl: IntlShape }) {
    if (folder.isSharedBetweenAllScopes) {
        return intl.formatMessage({ id: "comet.dam.folder.shared.name", defaultMessage: "Shared folder" });
    }

    return folder.name;
}
