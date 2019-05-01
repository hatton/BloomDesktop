import * as React from "react";
import { useState } from "react";
const wifiImage = require("./publish-via-wifi.svg");
const usbImage = require("./publish-via-usb.svg");
const fileImage = require("./publish-to-file.svg");
import Button from "@material-ui/core/Button";
import "./BRPublishScreen.less";
import { ConciseRadioGroup } from "../ConciseRadioGroup";

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
            <div className={"publishScreenRoot"}>
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
            <div //had to wrap this button because else material-ui overrides the margin
                className={"buttonWrapper"}
            >
                <Button variant="contained" color="primary">
                    Share
                </Button>
            </div>
        </>
    );
};
