import React = require("react");
import { getLocalization } from "./l10n";

// React hook to lookup localization
export function useL10n(
    english: string,
    l10nKey: string,
    l10nComment?: string,
    l10nParam0?: string,
    l10nParam1?: string
) {
    const [localizedText, setLocalizedText] = React.useState(english);
    React.useEffect(() => {
        getLocalization({
            english,
            l10nKey,
            l10nComment,
            l10nParam0,
            l10nParam1,
            // Review: what should we do with this lookupSuccessful?
            callback: (t, lookupSuccessful) => {
                setLocalizedText(t);
            }
        });
    }, []);
    return localizedText;
}
