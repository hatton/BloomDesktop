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
import { ProgressDialog, ProgressState } from "./ProgressDialog";
import { loremIpsum } from "lorem-ipsum";
import { withA11y } from "@storybook/addon-a11y";
import { withKnobs, text } from "@storybook/addon-knobs";

addDecorator(withA11y);

addDecorator(storyFn => (
    <ThemeProvider theme={theme}>
        <StorybookContext.Provider value={true}>
            {storyFn()}
        </StorybookContext.Provider>
    </ThemeProvider>
));

const testText =
    loremIpsum({
        count: 3,
        format: "html",
        units: "paragraphs"
    }) + "<a target='_blank' href='https://google.com'>google.com</a>";

storiesOf("ProgressDialog", module)
    .add("Working", () => (
        <div>
            <ProgressDialog
                progressState={ProgressState.Working}
                clientContext="progress"
                testProgressHtml={testText}
            />
        </div>
    ))
    .add("Done", () => (
        <div>
            <ProgressDialog
                progressState={ProgressState.Done}
                clientContext="progress"
                testProgressHtml={testText}
            />
        </div>
    ))
    .add("Error", () => (
        <div>
            <ProgressDialog
                progressState={ProgressState.Error}
                clientContext="progress"
                testProgressHtml={testText}
            />
        </div>
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
