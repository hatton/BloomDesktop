import * as React from "react";
import "./DeviceFrame.less";
import { Button } from "@material-ui/core";
import { useState } from "react";

/*
  Example usage:
  <DeviceFrame defaultLandscape={true}>
    <iframe..../>
  </DeviceFrame>
*/

export const DeviceAndControls: React.FunctionComponent<{
    defaultLandscape: boolean;
    url: string;
}> = props => {
    const [landscape, setLandscape] = useState(props.defaultLandscape);
    return (
        <div className="deviceAndControls">
            <div
                className={
                    "deviceFrame " + (landscape ? "landscape" : "portrait")
                }
            >
                <iframe title="book preview" src={props.url} />
            </div>
            <OrientationButton
                landscape={false}
                onClick={() => setLandscape(false)}
            />
            <OrientationButton
                landscape={true}
                onClick={() => setLandscape(true)}
            />
        </div>
    );
};

const OrientationButton: React.FunctionComponent<{
    landscape: boolean;
    onClick: (landscape: boolean) => void;
}> = props => (
    <div
        className={
            "deviceFrame orientation-button " +
            (props.landscape ? "landscape" : "portrait")
        }
        onClick={() => props.onClick(props.landscape)}
    />
);
