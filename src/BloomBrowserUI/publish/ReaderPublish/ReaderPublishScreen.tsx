import * as React from "react";
import { Link } from "@material-ui/core";
import {
    BasePublishScreen,
    PreviewPanel,
    PublishPanel,
    HelpGroup,
    SettingsPanel
} from "../BasePublishScreen/BasePublishScreen";
import { MethodChooser } from "./MethodChooser";
import { PublishFeaturesGroup } from "../BasePublishScreen/PublishFeaturesGroup";
import { ThumbnailGroup } from "../BasePublishScreen/ThumbnailGroup";
import "../android/androidFrame.less";
import { DeviceFrame } from "../BasePublishScreen/DeviceFrame";
import ReactDOM = require("react-dom");

export const BRPublishScreen = () => {
    return (
        <BasePublishScreen>
            <PreviewPanel>
                <DeviceFrame landscape={false}>Hello</DeviceFrame>
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
    );
};

// a bit goofy... currently the html loads everying in publishUIBundlejs. So all the publish screens
// get any not-in-a-class code called, including ours. But it only makes sense to get wired up
// if that html has the root page we need.
if (document.getElementById("BloomReaderPublishScreen")) {
    ReactDOM.render(
        <BRPublishScreen />,
        document.getElementById("BloomReaderPublishScreen")
    );
}
