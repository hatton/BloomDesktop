//import { install } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

//This magic incantation is needed to make this all work, at least with material-ui 3.9
// https://github.com/mui-org/material-ui/issues/14078
//install();

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: green
    },
    typography: {
        fontSize: 16
    },
    overrides: {
        MuiTypography: {
            h6: {
                fontSize: "1rem"
            }
        },
        MuiIconButton: {
            root: {
                paddingTop: 2,
                paddingBottom: 2
            }
        }
    }
});

export default theme;
