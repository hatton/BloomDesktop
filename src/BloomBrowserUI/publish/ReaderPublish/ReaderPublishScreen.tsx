import * as React from "react";
import { useState, useContext } from "react";
import { Link } from "@material-ui/core";
import {
    BasePublishScreen,
    PreviewPanel,
    PublishPanel,
    HelpGroup,
    SettingsPanel
} from "../commonPublish/BasePublishScreen";
import { MethodChooser } from "./MethodChooser";
import { PublishFeaturesGroup } from "../commonPublish/PublishFeaturesGroup";
import { ThumbnailGroup } from "../commonPublish/ThumbnailGroup";
import "./ReaderPublish.less";
import { DeviceFrame } from "../commonPublish/DeviceFrame";
import ReactDOM = require("react-dom");
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../bloomMaterialUITheme";
import { StorybookContext } from "../../.storybook/StoryBookContext";
import WebSocketManager from "../../utils/WebSocketManager";
import { ReaderPublishProgress } from "./ReaderPublishProgress";

export const ReaderPublishScreen = () => {
    const inStorybookMode = useContext(StorybookContext);
    //const [showingDialog, setShowingDialog] = useState(false);

    const [bookUrl, setBookUrl] = useState(
        inStorybookMode
            ? // "https://s3.amazonaws.com/BloomLibraryBooks-Sandbox/ken@example.com/11c2c600-35af-488b-a8d6-3479edcb9217/Aeneas"
              window.location.protocol +
                  "//" +
                  window.location.host +
                  "/templates/Sample Shells/The Moon and the Cap" // Enhance: provide an actual bloomd in the source tree
            : "" // otherwise, wait for the websocket to deliver a url when the c# has finished creating the bloomd
    );

    React.useEffect(() => {
        //nb: this clientContext must match what the c# end of the socket is sending on
        WebSocketManager.addListener("publish-android", e => {
            if (e.id === "androidPreview" && e.message) {
                const x = e.message;
                setBookUrl(x);
            }
        });
    }, []);
    // React.useEffect(() => {
    //     BloomApi.postData("publish/android/updatePreview", {});
    // }, []);
    const pathToOutputBrowser = inStorybookMode ? "./" : "../../";

    return (
        <>
            <BasePublishScreen>
                <PreviewPanel>
                    <DeviceFrame
                        defaultLandscape={false}
                        url={
                            pathToOutputBrowser +
                            "bloom-player/dist/bloomplayer.htm?url=" +
                            bookUrl
                        }
                    />
                </PreviewPanel>
                <PublishPanel>
                    <MethodChooser />
                </PublishPanel>
                <SettingsPanel>
                    <PublishFeaturesGroup />
                    <ThumbnailGroup />
                    <HelpGroup>
                        <Link>About Bloom Reader</Link>
                        {/* <Link>About Book Features</Link> */}
                        <Link>Troubleshooting Tips</Link>
                        <Link>Get Bloom Reader App</Link>
                    </HelpGroup>
                </SettingsPanel>
            </BasePublishScreen>

            <ReaderPublishProgress />
        </>
    );
};

// a bit goofy... currently the html loads everything in publishUIBundlejs. So all the publish screens
// get any not-in-a-class code called, including ours. But it only makes sense to get wired up
// if that html has the root page we need.
if (document.getElementById("BloomReaderPublishScreen")) {
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <ReaderPublishScreen />
        </ThemeProvider>,
        document.getElementById("BloomReaderPublishScreen")
    );
}
