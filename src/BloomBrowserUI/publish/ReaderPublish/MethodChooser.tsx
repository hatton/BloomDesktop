import * as React from "react";
import { useState, useEffect } from "react";
import "./ReaderPublish.less";
import { ConciseRadioGroup } from "../commonPublish/ConciseRadioGroup";
import BloomButton from "../../react_components/bloomButton";
import { BloomApi } from "../../utils/bloomApi";
import { isLinux } from "../../utils/isLinux";
import { useL10n } from "../../react_components/l10nHooks";

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
    useEffect(
        () =>
            BloomApi.get("publish/android/method", result => {
                setMethod(result.data);
            }),
        []
    );

    return (
        <>
            <div className={"methodChooserRoot"}>
                <ConciseRadioGroup
                    value={method}
                    setter={m => {
                        setMethod(m);
                        // let Bloom remember this choice as the default for next time
                        BloomApi.postString("publish/android/method", m);
                    }}
                    choices={{
                        wifi: useL10n(
                            "Share over Wi-Fi",
                            "PublishTab.Android.ChooseWifi"
                        ),
                        file: useL10n(
                            "Save Bloom Reader File",
                            "PublishTab.Android.ChooseFile"
                        ),
                        usb: useL10n(
                            "Send over USB Cable",
                            "PublishTab.Android.ChooseUSB"
                        )
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
                {getStartButton(method)}
            </div>
        </>
    );
};

function getStartButton(method: string) {
    switch (method) {
        case "file":
            return (
                <BloomButton
                    l10nKey="PublishTab.Save"
                    l10nComment="Button that tells Bloom to save the book as a .bloomD file."
                    clickApiEndpoint="publish/android/file/save"
                    enabled={true}
                    hasText={true}
                >
                    Save...
                </BloomButton>
            );
        case "usb":
            return (
                <BloomButton
                    l10nKey="PublishTab.Android.Usb.Start"
                    l10nComment="Button that tells Bloom to send the book to a device via USB cable."
                    enabled={true}
                    clickApiEndpoint="publish/android/usb/start"
                    hidden={isLinux()}
                    hasText={true}
                >
                    Connect with USB cable
                </BloomButton>
            );
        case "wifi":
            return (
                <BloomButton
                    l10nKey="PublishTab.Android.Wifi.Start"
                    l10nComment="Button that tells Bloom to begin offering this book on the wifi network."
                    enabled={true}
                    clickApiEndpoint="publish/android/wifi/start"
                    hasText={true}
                >
                    Share
                </BloomButton>
            );
        default:
            throw new Error("Unhandled method choice");
    }
}
