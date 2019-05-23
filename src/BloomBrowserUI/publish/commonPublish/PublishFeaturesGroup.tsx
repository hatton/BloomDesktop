import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { FeatureSwitch } from "./FeatureSwitch";
import { SettingsGroup } from "./BasePublishScreen";

export const PublishFeaturesGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Features">
        <FormGroup>
            {/* <FeatureSwitch label="Talking Book" /> */}
            <FeatureSwitch
                english="Motion Book"
                l10nKey="PublishTab.Android.MotionBookMode"
                // tslint:disable-next-line:max-line-length
                l10nComment="Motion Books are Talking Books in which the picture fils the screen, then pans and zooms while you hear the voice recording. This happens only if you turn the book sideways."
                apiEndpoint="publish/android/motionBookMode"
            />
            {/* <FeatureSwitch label="Sign Language" />
            <FeatureSwitch label="Image Descriptions" /> */}
        </FormGroup>
    </SettingsGroup>
);
