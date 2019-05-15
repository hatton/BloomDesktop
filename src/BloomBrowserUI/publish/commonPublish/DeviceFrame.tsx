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

export const DeviceFrame: React.FunctionComponent<{
    defaultLandscape: boolean;
}> = props => {
    const [landscape, setLandscape] = useState(props.defaultLandscape);
    return (
        <div className="deviceAndControls">
            <div className={"deviceFrame " + (landscape ? "landscape" : "")}>
                {props.children}
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
    <Button
        className="orientation-button"
        variant="contained"
        color="primary"
        onClick={() => props.onClick(props.landscape)}
    >
        {props.landscape ? "Landscape" : "Portrait"}
    </Button>
);
