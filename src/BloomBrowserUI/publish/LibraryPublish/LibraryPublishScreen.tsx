import * as React from "react";
import { Link } from "@material-ui/core";

import {
    BasePublishScreen,
    PreviewPanel,
    PublishPanel,
    HelpGroup,
    SettingsPanel
} from "../BasePublishScreen/BasePublishScreen";

import { UploadControl } from "./LibraryPublishControls";
import { PublishFeaturesGroup } from "../BasePublishScreen/PublishFeaturesGroup";
import { LanguageGroup } from "../BasePublishScreen/LanguageGroup";
import { AudioGroup } from "../BasePublishScreen/AudioGroup";
import { LibraryPreview } from "./LibraryPreview";

export const UploadScreen = () => {
    return (
        <BasePublishScreen>
            <PreviewPanel>
                <LibraryPreview />
            </PreviewPanel>
            <PublishPanel>
                <UploadControl />
            </PublishPanel>
            <SettingsPanel>
                <PublishFeaturesGroup />
                <LanguageGroup />
                <AudioGroup />
                <HelpGroup>
                    <Link variant="body2">About BloomLibrary.org</Link>
                </HelpGroup>
            </SettingsPanel>
        </BasePublishScreen>
    );
};
