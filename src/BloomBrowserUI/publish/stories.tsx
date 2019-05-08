import theme from "./bloomMaterialUITheme";
import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import { addDecorator } from "@storybook/react";
//import "typeface-roboto";
import { BRPublishScreen } from "./BRPublish/BRPublishScreen";
import { UploadScreen } from "./UploadScreen/UploadScreen";
import { DeviceFrame } from "./BasePublishScreen/DeviceFrame";
import { StorybookContext } from "./StoryBookContext";

addDecorator(storyFn => (
    <ThemeProvider theme={theme}>
        <StorybookContext.Provider value={true}>
            {storyFn()}
        </StorybookContext.Provider>
    </ThemeProvider>
));

storiesOf("PublishScreens", module)
    .add("DeviceFrame Portrait", () => (
        <DeviceFrame landscape={false}>Portrait</DeviceFrame>
    ))
    .add("DeviceFrame Landscape", () => (
        <DeviceFrame landscape={true}>Landscape</DeviceFrame>
    ))
    .add("BRPublishScreen", () => <BRPublishScreen />)
    .add("UploadScreen", () => <UploadScreen />);
