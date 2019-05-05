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
    // <div className="deviceFrame">
    //     <div className="deviceScreen">{props.children}</div>
    // </div>
    <div className="deviceScreen">{props.children}</div>
);
