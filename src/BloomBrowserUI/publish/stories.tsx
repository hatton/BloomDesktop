import theme from "./bloomMaterialUITheme";
import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import { addDecorator } from "@storybook/react";
//import "typeface-roboto";
import { BRPublishScreen } from "./BRPublish/BRPublishScreen";
import { UploadScreen } from "./UploadScreen/UploadScreen";
import { DeviceFrame } from "./BasePublishScreen/DeviceFrame";

addDecorator(storyFn => (
    <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
));

storiesOf("PublishScreens", module)
    .add("DeviceFrame", () => <DeviceFrame landscape={false} />)
    .add("BRPublishScreen", () => <BRPublishScreen />)
    .add("UploadScreen", () => <UploadScreen />);
