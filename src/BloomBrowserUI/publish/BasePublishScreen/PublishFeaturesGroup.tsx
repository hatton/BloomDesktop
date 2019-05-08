import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { FeatureSwitch } from "../FeatureSwitch";
import { SettingsGroup } from "./BasePublishScreen";

export const PublishFeaturesGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Features">
        <FormGroup>
            {/* <FeatureSwitch label="Talking Book" /> */}
            <FeatureSwitch label="Motion Book" />
            {/* <FeatureSwitch label="Sign Language" />
            <FeatureSwitch label="Image Descriptions" /> */}
        </FormGroup>
    </SettingsGroup>
);
