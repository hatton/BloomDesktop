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
import { createMuiTheme, TextField, Checkbox, Button } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import { MuiCheckbox } from "../react_components/muiCheckBox";
import { useDebouncedCallback } from "use-debounce";
const Isemail = require("isemail");
import WarningIcon from "@material-ui/icons/Warning";

export const ProblemDialog: React.FunctionComponent<{}> = props => {
    const [emailValid, setEmailValid] = React.useState<boolean | undefined>(
        undefined
    );
    const [debouncedEmailCheck] = useDebouncedCallback(value => {
        setEmailValid(
            value === ""
                ? undefined
                : Isemail.validate(value, {
                      errorLevel: true,
                      minDomainAtoms: 2
                  }) === 0
        );
    }, 100);

    return (
        <ThemeProvider theme={problemTheme}>
            <Dialog
                className="progress-dialog"
                open={true}
                // the behavior of fullWidth/maxWidth is very strange
                //fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle>{"Bloom encountered an error"}</DialogTitle>
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
                            />
                            <div id="how_much_group">
                                <Typography>
                                    How much has this happened?
                                </Typography>
                                <HowMuchSlider
                                    id="slider"
                                    defaultValue={1}
                                    min={0}
                                    max={2}
                                    step={1}
                                    //onChange={this.handleChange}
                                    marks={[
                                        {
                                            value: 0,
                                            label: "" //"First Time"
                                        },
                                        {
                                            value: 1,
                                            label: ""
                                        },
                                        {
                                            value: 2,
                                            label: "" //"It keeps happening"
                                        }
                                    ]}
                                />
                                <div id="scale_labels">
                                    <Typography variant="body2">
                                        First Time
                                    </Typography>
                                    <Typography variant="body2">
                                        It keeps happening
                                    </Typography>
                                </div>
                            </div>
                            <TextField
                                className="email"
                                variant="outlined"
                                label="Email"
                                rows="1"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                multiline={false}
                                aria-label="email"
                                error={!!!emailValid}
                                //helperText={"ERROR"}
                                onChange={event =>
                                    debouncedEmailCheck(event.target.value)
                                }
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

                            <div id="privacy">
                                <WarningIcon color="primary" />
                                <Typography>
                                    Bloom will include diagnostic information
                                    with your report. Your report will not be
                                    private.
                                </Typography>
                                <Button color="primary">Learn More...</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <BloomButton enabled={true} l10nKey="bogus" hasText={true}>
                        Submit
                    </BloomButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

const kProblemColor = "#F3AA18";

const problemTheme = createMuiTheme({
    //this spacing doesn't seem to do anything. The example at https://material-ui.com/customization/default-theme/
    // would be spacing{unit:23} but that gives an error saying to use a number
    //spacing: 23,
    palette: {
        primary: { main: kProblemColor }
    },
    typography: {
        fontSize: 12
        //,fontFamily: ["NotoSans", "Roboto", "sans-serif"]
    },
    props: {
        MuiLink: {
            variant: "body1" // without this, they come out in times new roman :-)
        }
    },
    overrides: {
        MuiOutlinedInput: {
            input: {
                padding: "7px"
            }
        },
        MuiDialogTitle: {
            root: {
                backgroundColor: kProblemColor,
                "& h6": { fontWeight: "bold" }
            }
        },
        MuiDialogActions: {
            root: {
                backgroundColor: "#FFFFFF"
            }
        }
    }
});

// The classnames used have runtime numbers, so it's not possible to
// do the styling just with css, have to use MUI's style system:
const HowMuchSlider = withStyles({
    track: {
        height: 2
    },
    rail: {
        height: 2,
        //opacity: 0.5,
        backgroundColor: "#bfbfbf"
    },
    mark: {
        width: 6,
        height: 6,
        // //border-radius: 4px;
        backgroundColor: "lightgray",
        marginTop: -2,
        borderRadius: 3
    },
    markActive: {
        backgroundColor: "currentColor"
    }
})(Slider);
