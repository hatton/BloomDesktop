import * as React from "react";
import { useState, useContext } from "react";
import { ProgressDialog, ProgressState } from "../commonPublish/ProgressDialog";
import { BloomApi } from "../../utils/bloomApi";
import WebSocketManager from "../../utils/WebSocketManager";
import { StorybookContext } from "../../.storybook/StoryBookContext";

const kWebSocketLifetime = "publish-android";

export const ReaderPublishProgressDialog = () => {
    const [accumulatedMessages, setAccumulatedMessages] = useState("");
    const [progressState, setProgressState] = useState(ProgressState.Working);
    const [heading, setHeading] = useState("Creating Digital Book");
    // see note below on the use of this variable
    const [errorWasEncountered, setGlobalErrorEncountered] = useState(false);
    React.useEffect(() => {
        WebSocketManager.addListener(kWebSocketLifetime, e => {
            if (e.id === "publish/android/state") {
                switch (e.message) {
                    case "stopped":
                        setProgressState(ProgressState.Done);
                        break;
                    case "UsbStarted":
                        setHeading("Sending via USB Cable");
                        setProgressState(ProgressState.Serving);
                        break;
                    case "ServingOnWifi":
                        setHeading("Sharing");
                        setProgressState(ProgressState.Serving);
                        break;
                    default:
                        throw new Error(
                            "Method Chooser does not understand the state: " +
                                e.message
                        );
                }
            }
        });
        WebSocketManager.addListener("publish-android", e => {
            if (e.id === "progress") {
                if (e.message!.indexOf("data-errorMessage") > -1) {
                    setGlobalErrorEncountered(true);
                }
                if (e.cssStyleRule) {
                    setAccumulatedMessages(
                        oldMessages =>
                            oldMessages +
                            `<span style='${e.cssStyleRule}'>${
                                e.message
                            }</span><br/>`
                    );
                } else {
                    setAccumulatedMessages(
                        oldMessages => oldMessages + `${e.message || ""}<br/>`
                    );
                }
            }
        });
    }, []);

    React.useEffect(() => {
        // we need to be ready to listen to progress messages from the server,
        // before we kick anything off on the server.
        WebSocketManager.notifyReady("publish-android", () => {
            // We agonized over the fact that "updatePreview" doesn't have anything to do with displaying progress.
            // It just so happens that 1) this is the first thing we do in this screen and 2) after it, we
            // need to do something to the state of the dialog.
            // But the alternative gets complicated too... the weirdness here is that we need to
            // do something (change the state of the dialog) when the postData's promise is satisfied.
            // (That is, when the preview construction is complete).
            BloomApi.postData("publish/android/updatePreview", {}, () => {
                setProgressState(() =>
                    errorWasEncountered
                        ? ProgressState.Done
                        : ProgressState.Closed
                );
            });
        });
    }, []);

    return (
        <ProgressDialog
            heading={heading}
            messages={accumulatedMessages}
            progressState={progressState}
            onUserStopped={() => {
                BloomApi.postData("publish/android/usb/stop", {});
                BloomApi.postData("publish/android/wifi/stop", {});
            }}
            onUserCanceled={() => {}}
            onUserClosed={() => {
                setGlobalErrorEncountered(false);
                setProgressState(ProgressState.Closed);
            }}
            errorEncountered={errorWasEncountered}
        />
    );
};
