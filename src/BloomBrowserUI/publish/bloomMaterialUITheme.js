import { createMuiTheme } from "@material-ui/core/styles";

const bloomBlue = "#1d94a4";

// lots of examples: https://github.com/search?q=createMuiTheme&type=Code
const theme = createMuiTheme({
    //this spacing doesn't seem to do anything. The example at https://material-ui.com/customization/default-theme/
    // would be spacing{unit:23} but that gives an error saying to use a number
    //spacing: 23,
    palette: {
        primary: { main: bloomBlue },
        secondary: { main: bloomBlue }
    },
    typography: {
        fontSize: 12
    },
    props: {
        MuiLink: {
            variant: "body1" // without this, they come out in times new roman :-)
        }
    },
    overrides: {
        MuiTypography: {
            h6: {
                fontSize: "1rem"
            }
        }
        // this stopped working with material-ui 4.0 beta
        // MuiIconButton: {
        //     root: {
        //         spacing: 0,
        //         paddingTop: 3,
        //         paddingBottom: 3
        //     }
        // },
        // MuiSwitch: { didn't work
        //     padding: 2,
        //     root: {
        //         padding: 2
        //     }
        // }
    }
});

export default theme;
