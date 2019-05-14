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
import { BloomApi } from "../../utils/bloomApi";

export const ReaderPublishScreen = () => {
    const inStorybookMode = useContext(StorybookContext);
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
    React.useEffect(() => {
        BloomApi.postData("publish/android/updatePreview", {});
    }, []);
    const pathToOutputBrowser = inStorybookMode ? "./" : "../../";

    return (
        // the themeprovider is needed only because at the moment this is a top-level component because our Publish
        // tab is still in c# win-forms land. Once that tab has moved to a web screen, then the theme can be moved
        // up to the new root
        <ThemeProvider theme={theme}>
            <BasePublishScreen>
                <PreviewPanel>
                    <DeviceFrame landscape={false}>
                        <iframe
                            style={{ width: "100%", height: "100%" }}
                            src={
                                pathToOutputBrowser +
                                "bloom-player/dist/bloomplayer.htm?url=" +
                                bookUrl
                            }
                        />
                    </DeviceFrame>
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
        </ThemeProvider>
    );
};

// a bit goofy... currently the html loads everything in publishUIBundlejs. So all the publish screens
// get any not-in-a-class code called, including ours. But it only makes sense to get wired up
// if that html has the root page we need.
if (document.getElementById("BloomReaderPublishScreen")) {
    ReactDOM.render(
        <ReaderPublishScreen />,
        document.getElementById("BloomReaderPublishScreen")
    );
}
