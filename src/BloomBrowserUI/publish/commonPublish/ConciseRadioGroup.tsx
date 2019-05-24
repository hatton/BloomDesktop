import * as React from "react";
import {
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio
} from "@material-ui/core";

/* This is a "controlled component".

Example use:
    const [method, setMethod] = BloomApi.useApiString("publish/android/method", "wifi");
    return(
        <ConciseRadioGroup
          value={method}
          setter={setMethod}
          choices={{
            wifi: "Share over Wi-FI",
            file: "Save to a file",
            usb: "Send via USB Cable"
          }}
        />)
*/

export const ConciseRadioGroup: React.FunctionComponent<{
    // the choices object should have an entry for each choice; the field of each is the key, and the value is the string
    choices: object;
    // the current value, must match one of the keys found in `choices`.
    value: string;
    setter: (method: string) => void;
}> = props => {
    return (
        <FormControl margin="dense">
            {/* this 'dense' doesn't seem to do anything?*/}
            <RadioGroup
                value={props.value}
                onChange={(event, newValue) => props.setter(newValue)}
            >
                {Object.keys(props.choices).map(key => (
                    <FormControlLabel
                        key={key}
                        value={key}
                        control={<Radio color="primary" />}
                        label={(props.choices as any)[key]}
                        onChange={(e, n) => props.setter(key)}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};
