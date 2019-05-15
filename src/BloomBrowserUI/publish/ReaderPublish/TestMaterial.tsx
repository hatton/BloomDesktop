import * as React from "react";
import ReactDOM = require("react-dom");
import { Link, Button } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../bloomMaterialUITheme";

export const TestMaterial = () => {
    return (
        <ThemeProvider theme={theme}>
            <Button>Hello</Button>
        </ThemeProvider>
    );
};

// if (document.getElementById("BloomReaderPublishScreen")) {
//     ReactDOM.render(
//         <TestMaterial />,
//         document.getElementById("BloomReaderPublishScreen")
//     );
// }
