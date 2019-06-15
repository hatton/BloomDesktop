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
import { useState } from "react";
import { HowMuchGroup } from "./HowMuchGroup";
import { PrivacyGroup } from "./PrivacyGroup";
import { makeTheme, kindParams } from "./theme";
import { EmailField } from "./EmailField";
import { useDrawAttention } from "./UseDrawAttention";

export enum ProblemKind {
    User = "User",
    NonFatal = "NonFatal",
    Fatal = "Fatal"
}
export const ProblemDialog: React.FunctionComponent<{
    kind: ProblemKind;
}> = props => {
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const [theme, setTheme] = useState<Theme | undefined>(undefined);
    const [whatDoing, setWhatDoing] = useState("");
    React.useEffect(() => {
        setTheme(makeTheme(props.kind));
    }, [props.kind]);
    const whatWereYouDoingAttentionClass = useDrawAttention(
        submitAttempts,
        () => whatDoing.trim().length > 0
    );
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
                                // can't use id for css because that goes down to a child element
                                className={
                                    "what_were_you_doing " +
                                    whatWereYouDoingAttentionClass
                                }
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
                                    submitAttempts > 0 &&
                                    whatDoing.trim().length == 0
                                }
                            />
                            <HowMuchGroup />

                            <EmailField submitAttempts={submitAttempts} />
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
                            setSubmitAttempts(submitAttempts + 1);
                        }}
                    >
                        Submit
                    </BloomButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};
