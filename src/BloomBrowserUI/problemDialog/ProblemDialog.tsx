import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { BloomApi } from "../utils/bloomApi";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { ThemeProvider } from "@material-ui/styles";
import "./ProblemDialog.less";
import BloomButton from "../react_components/bloomButton";
import TextField from "@material-ui/core/TextField";
import { MuiCheckbox } from "../react_components/muiCheckBox";
import { useState, useEffect, useRef } from "react";
import { HowMuchGroup } from "./HowMuchGroup";
import { PrivacyNotice } from "./PrivacyNotice";
import { makeTheme, kindParams } from "./theme";
import { EmailField, isValidEmail } from "./EmailField";
import { useDrawAttention } from "./UseDrawAttention";
import ReactDOM = require("react-dom");
import { PrivacyScreen } from "./PrivacyScreen";

export enum ProblemKind {
    User = "User",
    NonFatal = "NonFatal",
    Fatal = "Fatal"
}

enum Mode {
    gather,
    submitting,
    submitted,
    showPrivacyDetails
}

export const ProblemDialog: React.FunctionComponent<{
    kind: ProblemKind;
}> = props => {
    const [mode, setMode] = useState(Mode.gather);
    const [includeBook, setIncludeBook] = useState(true);
    const [includeScreenshot, setIncludeScreenshot] = useState(true);
    const [email, setEmail] = BloomApi.useApiString(
        "problemReport/emailAddress",
        ""
    );
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const theme = makeTheme(props.kind);
    const [userInput, setWhatDoing] = useState("");
    const [bookName, setUnused] = BloomApi.useApiString(
        "problemReport/bookName",
        "??"
    );

    const whatWereYouDoingAttentionClass = useDrawAttention(
        submitAttempts,
        () => userInput.trim().length > 0
    );
    const submitButton = useRef(null);
    // Haven't got to work yet, see comment on the declaration of this function, below
    useCtrlEnterToSubmit(() => {
        if (submitButton && submitButton.current) {
            (submitButton.current as any).click();
        }
    });
    const AttemptSubmit = () => {
        if (!isValidEmail(email) || userInput.trim().length == 0) {
            setSubmitAttempts(submitAttempts + 1);
        } else {
            setMode(Mode.submitting);
            BloomApi.postJson(
                "problemReport/submit",
                {
                    kind: props.kind,
                    email,
                    userInput: `How much: TODO<br/>${userInput}`,
                    includeBook,
                    includeScreenshot
                },
                result => {
                    console.log(JSON.stringify(result.data));
                    setMode(Mode.submitted);
                }
            );
        }
    };

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
                    {(() => {
                        switch (mode) {
                            case Mode.submitting:
                                return <Typography>Submitting...</Typography>;
                            case Mode.submitted:
                                return (
                                    <>
                                        <Typography>Done</Typography>
                                    </>
                                );
                            case Mode.showPrivacyDetails:
                                return (
                                    <PrivacyScreen
                                        includeBook={includeBook}
                                        onBack={() => setMode(Mode.gather)}
                                    />
                                );
                            case Mode.gather:
                                return (
                                    <>
                                        <Typography id="please_help_us">
                                            Please help us reproduce this
                                            problem on our computers.
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
                                                        setWhatDoing(
                                                            event.target.value
                                                        );
                                                    }}
                                                    error={
                                                        submitAttempts > 0 &&
                                                        userInput.trim()
                                                            .length == 0
                                                    }
                                                />
                                                <HowMuchGroup />

                                                <EmailField
                                                    email={email}
                                                    onChange={v => setEmail(v)}
                                                    submitAttempts={
                                                        submitAttempts
                                                    }
                                                />
                                            </div>
                                            <div className="column2">
                                                <MuiCheckbox
                                                    label="Include book '{0}'"
                                                    l10nKey="ReportProblemDialog.IncludeBookButton"
                                                    l10nParam0={bookName}
                                                    checked={includeBook}
                                                    onCheckChanged={v =>
                                                        setIncludeBook(
                                                            v as boolean
                                                        )
                                                    }
                                                />
                                                <MuiCheckbox
                                                    label="Include this screenshot:"
                                                    l10nKey="ReportProblemDialog.IncludeScreenshotButton"
                                                    checked={includeScreenshot}
                                                    onCheckChanged={v =>
                                                        setIncludeScreenshot(
                                                            v as boolean
                                                        )
                                                    }
                                                />
                                                <img
                                                    src={
                                                        "/bloom/api/problemReport/screenshot"
                                                    }
                                                />
                                                <PrivacyNotice
                                                    onLearnMore={() =>
                                                        setMode(
                                                            Mode.showPrivacyDetails
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                        }
                    })()}
                </DialogContent>
                <DialogActions>
                    {mode === Mode.submitted &&
                        props.kind !== ProblemKind.Fatal && (
                            <BloomButton
                                enabled={true}
                                l10nKey="ReportProblemDialog.Close"
                                hasText={true}
                                onClick={() => {
                                    BloomApi.post("dialog/close");
                                }}
                            >
                                Close
                            </BloomButton>
                        )}
                    {mode === Mode.submitted &&
                        props.kind === ProblemKind.Fatal && (
                            <BloomButton
                                enabled={true}
                                l10nKey="ReportProblemDialog.Quit"
                                hasText={true}
                                onClick={() => {
                                    BloomApi.post("dialog/close");
                                }}
                            >
                                Quit
                            </BloomButton>
                        )}
                    {mode === Mode.gather && (
                        <BloomButton
                            enabled={true}
                            l10nKey="ReportProblemDialog.SubmitButton"
                            hasText={true}
                            onClick={() => {
                                AttemptSubmit();
                            }}
                        >
                            Submit
                        </BloomButton>
                    )}
                    {mode === Mode.gather && props.kind === ProblemKind.User && (
                        <BloomButton
                            enabled={true}
                            l10nKey="Common.Cancel"
                            hasText={true}
                            variant="outlined"
                            onClick={() => {
                                BloomApi.post("dialog/close");
                            }}
                            ref={submitButton}
                        >
                            Cancel
                        </BloomButton>
                    )}
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

/* haven't got this to work yet; when the callback is called, `email` and other values are empty*/
function useCtrlEnterToSubmit(callback) {
    useEffect(() => {
        const handler = event => {
            if (event.ctrlKey && event.key === "Enter") {
                callback();
            }
        };

        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, []);
}

// allow plain 'ol javascript in the html to connect up react
(window as any).connectProblemDialog = (element: Element | null) => {
    ReactDOM.render(<ProblemDialog kind={ProblemKind.Fatal} />, element);
};
