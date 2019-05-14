import { Card, CardContent, Typography } from "@material-ui/core";
import React = require("react");

export const LibraryPreview: React.FunctionComponent = () => {
    return (
        <Card style={{ width: "400px" }}>
            <CardContent style={{ display: "flex", flexDirection: "row" }}>
                <img src="thumbnail.png" />
                <div>
                    <div>Foobar and me</div>
                    <div>Pages</div>
                    <div>Languages</div>
                    <div>Copyright</div>
                    <div>Uploaded by</div>
                    <div>Tags</div>
                </div>
            </CardContent>
        </Card>
    );
};
