import theme from "../bloomMaterialUITheme";
import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import { addDecorator } from "@storybook/react";
//import "typeface-roboto";
import { ReaderPublishScreen } from "./ReaderPublish/ReaderPublishScreen";
import { LibraryPublishScreen } from "./LibraryPublish/LibraryPublishScreen";
import { DeviceFrame } from "./commonPublish/DeviceFrame";
import { StorybookContext } from "../.storybook/StoryBookContext";
import { ProgressDialog, ProgressState } from "./commonPublish/ProgressDialog";
import { loremIpsum } from "lorem-ipsum";
import { withA11y } from "@storybook/addon-a11y";
import { LibraryPreview } from "./LibraryPublish/LibraryPreview";

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

storiesOf("Publish/ProgressDialog", module)
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

storiesOf("Publish/Library", module)
    .add("preview", () => (
        <div
            style={{
                padding: "40px"
            }}
        >
            <LibraryPreview />
        </div>
    ))
    .add("UploadScreen", () => <LibraryPublishScreen />);

storiesOf("Publish/DeviceFrame", module)
    .add("DeviceFrame Portrait", () => (
        <DeviceFrame landscape={false}>Portrait</DeviceFrame>
    ))
    .add("DeviceFrame Landscape", () => (
        <DeviceFrame landscape={true}>Landscape</DeviceFrame>
    ));

storiesOf("Publish/Reader", module).add("BRPublishScreen", () => (
    <ReaderPublishScreen />
));
