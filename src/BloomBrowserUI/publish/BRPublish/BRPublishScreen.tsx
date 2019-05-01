import * as React from "react";
import { Link } from "@material-ui/core";

import {
    BasePublishScreen,
    PreviewPanel,
    PublishPanel,
    SettingsGroup,
    HelpGroup,
    SettingsPanel
} from "../BasePublishScreen/BasePublishScreen";
import { MethodChooser } from "./MethodChooser";
import { PublishFeaturesGroup } from "../BasePublishScreen/PublishFeaturesGroup";
import { ThumbnailGroup } from "../BasePublishScreen/ThumbnailGroup";

export const BRPublishScreen = () => {
    return (
        <BasePublishScreen>
            <PreviewPanel>Preview this!</PreviewPanel>
            <PublishPanel>
                <MethodChooser />
            </PublishPanel>
            <SettingsPanel>
                <PublishFeaturesGroup />
                <ThumbnailGroup />
                <HelpGroup>
                    <Link>About Bloom Reader</Link>
                    <Link>About Book Features</Link>
                    <Link>Troubleshooting Tips</Link>
                    <Link>Get Bloom Reader App</Link>
                </HelpGroup>
            </SettingsPanel>
        </BasePublishScreen>
    );
};
