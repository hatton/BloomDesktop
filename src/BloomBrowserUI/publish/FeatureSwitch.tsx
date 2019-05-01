import * as React from "react";
import { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

// wrap up the complex material-ui checkbox in something simple
export const FeatureSwitch: React.FunctionComponent<{
    label: string;
}> = props => {
    const [checked, setChecked] = useState(true);
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e, newState) => setChecked(newState)}
                />
            }
            label={props.label}
        />
    );
};
