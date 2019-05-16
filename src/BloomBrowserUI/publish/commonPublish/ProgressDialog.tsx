import * as React from "react";
import { useState } from "react";
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
    Working,
    Done,
    Error
}

export const ProgressDialog: React.FunctionComponent<
    IProgressBoxProps & {
        progressState: ProgressState;
        onUserClosed: () => void;
    }
> = props => {
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

    const stillWorking = props.progressState == ProgressState.Working;
    const handleClose = () => {
        props.onUserClosed();
    };
    return (
        <Dialog
            className="progressDialog"
            open={props.progressState !== ProgressState.Closed}
            onClose={() => {
                // allow just clicking out of the dialog to close, unless we're still working,
                // in which case you have to go and click on "CANCEL"
                return stillWorking || handleClose();
            }}
        >
            <DialogTitle
                style={
                    props.progressState === ProgressState.Error
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
                    <ProgressBox {...props} progressBoxId={kProgressBoxId} />
                </Typography>
            </DialogContent>
            <DialogActions>
                {stillWorking || (
                    <Button
                        onClick={() => onCopy()}
                        color="secondary"
                        style={{ marginRight: "auto" }}
                    >
                        Copy to Clipboard
                    </Button>
                )}
                {stillWorking ? (
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        color="primary"
                    >
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
