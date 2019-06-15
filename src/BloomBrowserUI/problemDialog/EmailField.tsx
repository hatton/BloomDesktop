import * as React from "react";
import "./ProblemDialog.less";
import { TextField } from "@material-ui/core";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useDrawAttention } from "./UseDrawAttention";
//const Isemail = require("isemail"); not compatible with geckofx 45

export const EmailField: React.FunctionComponent<{
    submitAttempts: number;
}> = props => {
    //const [attentionClass, setAttentionClass] = useState("");
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [debouncedEmailCheck] = useDebouncedCallback(value => {
        setEmailValid(
            // Isemail.validate(value, {
            //     errorLevel: true,
            //     minDomainAtoms: 2
            // }) === 0
            true
        );
    }, 100);

    const attentionClass = useDrawAttention(
        props.submitAttempts,
        () => emailValid
    );

    return (
        <TextField
            className={"email " + attentionClass}
            variant="outlined"
            label="Email"
            rows="1"
            InputLabelProps={{
                shrink: true
            }}
            multiline={false}
            aria-label="email"
            error={
                (email.length > 0 && !emailValid) ||
                (props.submitAttempts > 0 && !emailValid)
            }
            //helperText={"ERROR"}
            onChange={event => {
                setEmail(event.target.value);
                debouncedEmailCheck(event.target.value);
            }}
        />
    );
};
