import * as React from "react";
import { useState, useContext } from "react";
import { ProgressDialog, ProgressState } from "../commonPublish/ProgressDialog";
import { BloomApi } from "../../utils/bloomApi";
import WebSocketManager from "../../utils/WebSocketManager";

// see note below on the use of this variable
let globalErrorEncountered = false;
const kWebSocketLifetime = "publish-android";

export const ReaderPublishProgressDialog = () => {
    const [progressState, setProgressState] = useState(ProgressState.Working);
    const [firstTime, setFirstTime] = useState(true);
    React.useEffect(() => {
        WebSocketManager.addListener(kWebSocketLifetime, e => {
            if (e.id === "publish/android/state") {
                switch (e.message) {
                    case "stopped":
                        setProgressState(ProgressState.Done);
                        break;
                    case "UsbStarted":
                    case "ServingOnWifi":
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
    });
    return (
        <ProgressDialog
            progressState={progressState}
            clientContext="publish-android"
            onGotErrorMessage={() => {
                //TODO: re-enable somehow: setProgressState(ProgressState.Error);

                // we can't use a state-based flag because that is async
                // and, in tests, the updatePreview returns before the
                // state change actually makes it out to the state variable
                globalErrorEncountered = true;
            }}
            onUserStopped={() => {
                BloomApi.postData("publish/android/usb/stop", {});
                BloomApi.postData("publish/android/wifi/stop", {});
            }}
            onUserCanceled={() => {}}
            onUserClosed={() => {
                setProgressState(ProgressState.Closed);
            }}
            onReadyToReceive={() => {
                if (firstTime) {
                    BloomApi.postData(
                        "publish/android/updatePreview",
                        {},
                        () => {
                            //  if (!globalErrorEncountered) {
                            setProgressState(ProgressState.Closed);
                            //  }
                        }
                    );
                    setFirstTime(false);
                }
            }}
        />
    );
};
