import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { FeatureSwitch } from "../FeatureSwitch";
import { SettingsGroup } from "./BasePublishScreen";

export const AudioGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Audio">
        <FormGroup>
            <FeatureSwitch label="Narration" />
            <FeatureSwitch label="Background Music" />
        </FormGroup>
    </SettingsGroup>
);
