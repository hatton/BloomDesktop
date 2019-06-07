import { Card, CardContent, Typography } from "@material-ui/core";
import React = require("react");
import { BloomApi } from "../../utils/bloomApi";

// NOTE: this is something of a placeholder for future work

export const LibraryPreview: React.FunctionComponent<{
    // for use in storybook, give it the path to Bloom's server, like http://localhost:8089
    serverPrefix: string;
}> = props => {
    const [meta] = BloomApi.useApiJson("book/metadata");
    return (
        <Card style={{ width: "600px" }}>
            <CardContent style={{ display: "flex", flexDirection: "row" }}>
                {/* <img
                    className={"thumbnail"}
                    src={
                        (props.serverPrefix || "") +
                        "/bloom/api/publish/android/thumbnail"
                    }
                /> */}
                <div>
                    <Typography component="h1" variant="h3">
                        {meta.title}
                    </Typography>
                    <Typography>
                        <div>{meta.pageCount + " pages"}</div>
                        <div>{meta.copyright}</div>
                        <div>{"License:" + meta.license}</div>
                        <div>{meta.tags ? meta.tags.join(" ") : "--"}</div>
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};
