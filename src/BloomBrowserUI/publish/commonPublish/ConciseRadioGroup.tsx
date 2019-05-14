import * as React from "react";
import { useState, Dispatch, SetStateAction } from "react";
import {
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio
} from "@material-ui/core";

/* Example use:
    const [method, setMethod] = useState("file");
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
    choices: any;
    value: string;
    setter: Dispatch<SetStateAction<string>>;
}> = props => {
    const [value, setValue] = useState(props.value);
    return (
        <FormControl margin="dense">
            {/* this 'dense' doesn't seem to do anything?*/}
            <RadioGroup
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
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
