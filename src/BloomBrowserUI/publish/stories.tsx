import theme from "./bloomMaterialUITheme";
import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import { addDecorator } from "@storybook/react";
//import "typeface-roboto";
import { BRPublishScreen } from "./BRPublish/BRPublishScreen";
import { UploadScreen } from "./UploadScreen/UploadScreen";

addDecorator(storyFn => (
    <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
));

storiesOf("PublishScreens", module)
    .add("BRPublishScreen", () => <BRPublishScreen />)
    .add("UploadScreen", () => <UploadScreen />);
