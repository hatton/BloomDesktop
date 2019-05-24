import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { ApiCheckbox } from "../../react_components/ApiCheckbox";
import { SettingsGroup } from "./BasePublishScreen";
import { useL10n } from "../../react_components/l10nHooks";

export const PublishFeaturesGroup: React.FunctionComponent = () => (
    <SettingsGroup label={useL10n("Features", "PublishTab.Android.Features")}>
        <FormGroup>
            {/* <ApiCheckbox label="Talking Book" /> */}
            <ApiCheckbox
                english="Motion Book"
                l10nKey="PublishTab.Android.MotionBookMode"
                // tslint:disable-next-line:max-line-length
                l10nComment="Motion Books are Talking Books in which the picture fils the screen, then pans and zooms while you hear the voice recording. This happens only if you turn the book sideways."
                apiEndpoint="publish/android/motionBookMode"
            />
            {/* <ApiCheckbox label="Sign Language" />
            <ApiCheckbox label="Image Descriptions" /> */}
        </FormGroup>
    </SettingsGroup>
);
