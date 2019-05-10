import * as React from "react";
import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

export const ProgressDialog: React.FunctionComponent<{}> = props => {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open}>
            <MuiDialogTitle>Progress</MuiDialogTitle>
            <MuiDialogContent>
                <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Cancel
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};
