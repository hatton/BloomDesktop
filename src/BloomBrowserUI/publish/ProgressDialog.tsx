import * as React from "react";
import { useState } from "react";
import { withStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ProgressBox, {
    IProgressBoxProps
} from "../react_components/progressBox";
import { BloomApi } from "../utils/bloomApi";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

export enum ProgressState {
    Working,
    Done,
    Error
}

export const ProgressDialog: React.FunctionComponent<
    IProgressBoxProps & { progressState: ProgressState }
> = props => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const onCopy = () => {
        // document.execCommand("copy") does not work in Bloom's geckofx.
        BloomApi.postDataWithConfig(
            "publish/android/textToClipboard",
            document.getElementById("progress-box")!.innerText, // want to crash here if no progress box
            { headers: { "Content-Type": "text/plain" } }
        );
    };
    console.log("warning color:");
    console.log((theme as any).palette.warning);
    const stillWorking = props.progressState == ProgressState.Working;
    const handleClose = () => setOpen(false);
    return (
        <Dialog
            open={open}
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
                    <ProgressBox {...props} />
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
