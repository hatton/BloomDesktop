import * as React from "react";
import { FormGroup } from "@material-ui/core";
import { FeatureSwitch } from "../FeatureSwitch";
import { SettingsGroup } from "./BasePublishScreen";

export const LanguageGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Languages">
        <FormGroup>
            <FeatureSwitch label="English" />
            <FeatureSwitch label="Español" />
        </FormGroup>
    </SettingsGroup>
);
