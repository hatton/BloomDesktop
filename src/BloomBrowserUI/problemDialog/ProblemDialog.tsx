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
import { TextField, Theme } from "@material-ui/core";
import { MuiCheckbox } from "../react_components/muiCheckBox";
import { useState } from "react";
import { HowMuchGroup } from "./HowMuchGroup";
import { PrivacyGroup } from "./PrivacyGroup";
import { makeTheme, kindParams } from "./theme";
import { EmailField } from "./EmailField";
import { useDrawAttention } from "./UseDrawAttention";
import ReactDOM = require("react-dom");

export enum ProblemKind {
    User = "User",
    NonFatal = "NonFatal",
    Fatal = "Fatal"
}
export const ProblemDialog: React.FunctionComponent<{
    kind: ProblemKind;
}> = props => {
    const [includeBook, setIncludeBloom] = useState(true);
    const [includeScreenshot, setIncludeScreenshot] = useState(true);
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const [theme, setTheme] = useState<Theme | undefined>(undefined);
    const [whatDoing, setWhatDoing] = useState("");
    const [bookName] = BloomApi.useApiString("problemReport/bookName", "??");
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
                fullScreen={true}
                onClose={() => BloomApi.post("dialog/close")}
            >
                <DialogTitle>
                    {kindParams[props.kind.toString()].title}
                </DialogTitle>
                <DialogContent className="content">
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
                                autoFocus={true}
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
                                label="Include book '{0}'"
                                l10nKey="ReportProblemDialog.IncludeBookButton"
                                l10nParam0={bookName}
                                checked={includeBook}
                                onCheckChanged={v =>
                                    setIncludeBloom(v as boolean)
                                }
                            />
                            <MuiCheckbox
                                label="Include this screenshot:"
                                l10nKey="ReportProblemDialog.IncludeScreenshotButton"
                                checked={includeScreenshot}
                                onCheckChanged={v =>
                                    setIncludeScreenshot(v as boolean)
                                }
                            />
                            <img src={"/bloom/api/problemReport/screenshot"} />

                            <PrivacyGroup />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <BloomButton
                        enabled={true}
                        l10nKey="ReportProblemDialog.SubmitButton"
                        hasText={true}
                        onClick={() => {
                            setSubmitAttempts(submitAttempts + 1);
                        }}
                    >
                        Submit
                    </BloomButton>
                    <BloomButton
                        enabled={true}
                        l10nKey="Common.Cancel"
                        hasText={true}
                        variant="outlined"
                        onClick={() => {
                            BloomApi.post("dialog/close");
                        }}
                    >
                        Cancel
                    </BloomButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

if (document.getElementById("problemDialogRoot")) {
    ReactDOM.render(
        <ProblemDialog kind={ProblemKind.User} />,
        document.getElementById("problemDialogRoot")
    );
}
