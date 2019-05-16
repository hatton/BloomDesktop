import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import ProgressBox, {
    IProgressBoxProps
} from "../../react_components/progressBox";
import { BloomApi } from "../../utils/bloomApi";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { useTheme } from "@material-ui/styles";
import "./ProgressDialog.less";

export enum ProgressState {
    Closed,
    Working, // doing something that will lead to a "Done" or "Error"
    Done,
    Serving // doing something indefinitely, which user can stop
}
//IProgressBoxProps &
export const ProgressDialog: React.FunctionComponent<{
    messages: string;
    progressState: ProgressState;
    errorEncountered?: boolean; // do something visual to indicate there was a problem
    onUserClosed: () => void;
    onUserStopped: () => void;
    onUserCanceled: () => void;
}> = props => {
    const messagesDivRef = React.useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const kProgressBoxId = "progressBoxInsideDialog";
    const onCopy = () => {
        // document.execCommand("copy") does not work in Bloom's geckofx.
        BloomApi.postDataWithConfig(
            "publish/android/textToClipboard",
            document.getElementById(kProgressBoxId)!.innerText, // want to crash here if no progress box
            { headers: { "Content-Type": "text/plain" } }
        );
    };
    //React.useEffect(() => alert("constructing ProgressDialog"), []);
    const somethingStillGoing =
        props.progressState == ProgressState.Working ||
        props.progressState == ProgressState.Serving;

    // const scrollMessagesBoxToBottom = () => {
    //     // in  testing in FF, this worked the first time...
    //     // ...but in the old "ProgressBox" implementation, there apparently were times when the div wasn't around
    //     // yet, so it did a something like this
    //     window.requestAnimationFrame(() => {
    //         if (messagesDiv.current) {
    //             messagesDiv.current.scrollTop =
    //                 messagesDiv.current.scrollHeight;
    //         }
    //     });
    // };

    useEffect(() => {
        if (messagesDivRef.current) {
            messagesDivRef.current.scrollTop =
                messagesDivRef.current.scrollHeight;
        }
    }, [props.messages]); // do this every time the message text changes

    return (
        <Dialog
            className="progressDialog"
            open={props.progressState !== ProgressState.Closed}
            onBackdropClick={() => {
                // allow just clicking out of the dialog to close, unless we're still working,
                // in which case you have to go and click on "CANCEL" or "Stop Sharing"
                if (!somethingStillGoing) {
                    props.onUserClosed();
                }
            }}
        >
            <DialogTitle
                style={
                    props.errorEncountered
                        ? {
                              backgroundColor: (theme as any).palette.warning
                                  .main
                          }
                        : {}
                }
            >
                Progress
            </DialogTitle>
            <DialogContent style={{ width: "500px", height: "300px" }}>
                <Typography>
                    <div
                        ref={messagesDivRef}
                        dangerouslySetInnerHTML={{ __html: props.messages }}
                    />
                </Typography>
            </DialogContent>
            <DialogActions>
                {somethingStillGoing || (
                    <Button
                        onClick={() => onCopy()}
                        color="secondary"
                        style={{ marginRight: "auto" }}
                    >
                        Copy to Clipboard
                    </Button>
                )}

                {(() => {
                    switch (props.progressState) {
                        case ProgressState.Serving:
                            return (
                                <Button
                                    onClick={props.onUserStopped}
                                    color="primary"
                                    variant="contained"
                                >
                                    Stop Sharing
                                </Button>
                            );

                        case ProgressState.Working:
                            return null;
                        /* eventually we'll want this, but at the moment, we only use this state
                                    for making previews, and in that state Bloom doesn't have a way of
                                    cancelling.
                                <Button
                                    onClick={props.onUserCanceled}
                                    color="primary"
                                >
                                    Cancel
                                </Button>*/
                        case ProgressState.Done:
                            return (
                                <Button
                                    variant="contained"
                                    onClick={props.onUserClosed}
                                    color="primary"
                                >
                                    Close
                                </Button>
                            );
                        case ProgressState.Closed:
                            return null;
                    }
                })()}
            </DialogActions>
        </Dialog>
    );
};
