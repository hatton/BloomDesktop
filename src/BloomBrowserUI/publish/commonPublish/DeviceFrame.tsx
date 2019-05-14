import * as React from "react";
import "./DeviceFrame.less";

/*
  Example usage:
  <DeviceFrame landscape={true}>
    <iframe..../>
  </DeviceFrame>
*/

export const DeviceFrame: React.FunctionComponent<{
    landscape: boolean;
}> = props => (
    <div className={"deviceFrame " + (props.landscape ? "landscape" : "")}>
        {props.children}
    </div>
);
