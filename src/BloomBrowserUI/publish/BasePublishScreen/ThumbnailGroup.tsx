import * as React from "react";
import { SettingsGroup } from "./BasePublishScreen";
import { ColorChooser } from "../../react_components/colorChooser";
import { BloomApi } from "../../utils/bloomApi";
import { useState } from "react";
import { StorybookContext } from "../StoryBookContext";

export const ThumbnailGroup: React.FunctionComponent = () => (
    <SettingsGroup label="Thumbnail">
        <ThumbnailControl />
    </SettingsGroup>
);

const ThumbnailControl: React.FunctionComponent<{}> = props => {
    const [bookCoverColor, setBookCoverColor] = useState("lightgreen");
    const inStorybookMode = React.useContext(StorybookContext);
    return (
        <ColorChooser
            menuLeft={true}
            imagePath="/bloom/api/publish/android/thumbnail?color="
            backColorSetting={bookCoverColor}
            onColorChanged={colorChoice => {
                BloomApi.postDataWithConfig(
                    "publish/android/backColor",
                    colorChoice,
                    {
                        headers: {
                            "Content-Type": "text/plain"
                        }
                    },
                    //wait until it's set because once the state changes, a
                    // new image gets requested and we want that to happen
                    // only after the server has registered this change.
                    () => setBookCoverColor(colorChoice)
                );
                // if we're just in storybook, change the color even though the above axios call will fail
                if (inStorybookMode) {
                    setBookCoverColor(colorChoice);
                }
            }}
        />
    );
};
