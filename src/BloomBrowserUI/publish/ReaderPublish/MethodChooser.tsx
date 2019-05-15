import * as React from "react";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import "./ReaderPublish.less";
import { ConciseRadioGroup } from "../commonPublish/ConciseRadioGroup";
import { ProgressDialog, ProgressState } from "../commonPublish/ProgressDialog";
import WebSocketManager from "../../utils/WebSocketManager";
import BloomButton from "../../react_components/bloomButton";
import { BloomApi } from "../../utils/bloomApi";

const wifiImage = require("./publish-via-wifi.svg");
const usbImage = require("./publish-via-usb.svg");
const fileImage = require("./publish-to-file.svg");

const methodNameToImageUrl = {
    wifi: wifiImage,
    usb: usbImage,
    file: fileImage
};

// This is a set of radio buttons and image that goes with each choice, plus a button to start off the sharing/saving
export const MethodChooser: React.FunctionComponent = () => {
    const [method, setMethod] = useState("file"); //initially set state to wifi. Enhance: remember from last time?

    const methodImage = (methodNameToImageUrl as any)[method];
    return (
        <>
            <div className={"methodChooserRoot"}>
                <ConciseRadioGroup
                    value={method}
                    setter={setMethod}
                    choices={{
                        wifi: "Share over Wi-FI",
                        file: "Save to a file",
                        usb: "Send via USB Cable"
                    }}
                />
                <img
                    src={methodImage}
                    alt="An image that just illustrates the currently selected publishing method."
                />
            </div>
            <div
                //had to wrap this button because else material-ui overrides the margin
                className={"buttonWrapper"}
            >
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setProgressState(ProgressState.Working)}
                >
                    Share
                </Button> */}
                <BloomButton
                    l10nKey="PublishTab.Android.Wifi.Start"
                    l10nComment="Button that tells Bloom to begin offering this book on the wifi network."
                    enabled={true} //enabled={this.state.stateId === "stopped"}
                    clickEndpoint="publish/android/wifi/start"
                    hasText={true}
                >
                    Share
                </BloomButton>
            </div>{" "}
        </>
    );
};
