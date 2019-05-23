import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { ApiCheckbox } from "../../react_components/ApiCheckbox";
import { SettingsGroup } from "./BasePublishScreen";

export const AudioGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Audio">
        <FormGroup>
            {/* <FeatureSwitch label="Narration" />
            <FeatureSwitch label="Background Music" /> */}
        </FormGroup>
    </SettingsGroup>
);
