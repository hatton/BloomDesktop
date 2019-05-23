import * as React from "react";
import { MuiCheckbox } from "./muiCheckBox";
import { BloomApi } from "../utils/bloomApi";

// A localized checkbox that is backed by a boolean API get/set
export const ApiCheckbox: React.FunctionComponent<{
    english: string;
    l10nKey: string;
    l10nComment?: string;
    apiEndpoint: string;
}> = props => {
    const [checked, setChecked] = BloomApi.useGetBoolean(
        props.apiEndpoint,
        false
    );

    return (
        <MuiCheckbox
            checked={checked}
            english={props.english}
            l10nKey={props.l10nKey}
            l10nComment={props.l10nComment}
            onCheckChanged={(newState: boolean | null) => {
                setChecked(!!newState);
            }}
        />
    );
};
