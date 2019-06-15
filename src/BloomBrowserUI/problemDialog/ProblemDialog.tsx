import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { BloomApi } from "../utils/bloomApi";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles, ThemeProvider } from "@material-ui/styles";
import "./ProblemDialog.less";
import BloomButton from "../react_components/bloomButton";
import { createMuiTheme, TextField, Button, Theme } from "@material-ui/core";

import { MuiCheckbox } from "../react_components/muiCheckBox";
import { useDebouncedCallback } from "use-debounce";
const Isemail = require("isemail");

import { useState } from "react";
import { HowMuchGroup } from "./HowMuchGroup";
import { PrivacyGroup } from "./PrivacyGroup";
import { makeTheme, kindParams } from "./theme";

export enum ProblemKind {
    User = "User",
    NonFatal = "NonFatal",
    Fatal = "Fatal"
}
export const ProblemDialog: React.FunctionComponent<{
    kind: ProblemKind;
}> = props => {
    const [emailValid, setEmailValid] = useState(false);
    const [emailErrorShake, setEmailErrorShake] = useState("");
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [theme, setTheme] = useState<Theme | undefined>(undefined);
    const [whatDoing, setWhatDoing] = useState("");
    const [email, setEmail] = useState("");
    const [debouncedEmailCheck] = useDebouncedCallback(value => {
        setEmailValid(
            Isemail.validate(value, {
                errorLevel: true,
                minDomainAtoms: 2
            }) === 0
        );
    }, 100);
    React.useEffect(() => {
        setTheme(makeTheme(props.kind));
    }, [props.kind]);

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                className="progress-dialog"
                open={true}
                // the behavior of fullWidth/maxWidth is very strange
                //fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle>
                    {kindParams[props.kind.toString()].title}
                </DialogTitle>
                <DialogContent
                    className="content"
                    //style={{ width: "500px", height: "300px" }}
                >
                    <Typography id="please_help_us">
                        Please help us reproduce this problem on our computers.
                    </Typography>
                    <div id="row2">
                        <div className="column1">
                            <TextField
                                className="what_were_you_doing" // can't use id for css because that goes down to a child element
                                variant="outlined"
                                label="What were you doing?"
                                rows="3"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                multiline={true}
                                aria-label="What were you doing?"
                                onChange={event => {
                                    setWhatDoing(event.target.value);
                                }}
                                error={
                                    submitAttempted &&
                                    whatDoing.trim().length == 0
                                }
                            />
                            <HowMuchGroup />

                            <TextField
                                className={"email " + emailErrorShake}
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
                                    (submitAttempted && !emailValid)
                                }
                                //helperText={"ERROR"}
                                onChange={event => {
                                    setEmail(event.target.value);
                                    debouncedEmailCheck(event.target.value);
                                }}
                            />
                        </div>
                        <div className="column2">
                            <MuiCheckbox
                                label="Include book 'foobar'"
                                l10nKey="bogus"
                                checked={true}
                                onCheckChanged={() => {}}
                            />
                            <MuiCheckbox
                                label="Include this screenshot:"
                                l10nKey="bogus"
                                checked={true}
                                onCheckChanged={() => {}}
                            />
                            <img src="bogus" />

                            <PrivacyGroup />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <BloomButton
                        enabled={true}
                        l10nKey="bogus"
                        hasText={true}
                        onClick={() => {
                            setSubmitAttempted(true);
                            if (!emailValid) {
                                setEmailErrorShake("drawAttention");
                                window.setTimeout(
                                    () => setEmailErrorShake(""),
                                    1000
                                );
                            }
                        }}
                    >
                        Submit
                    </BloomButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};
