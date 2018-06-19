import * as React from "react";
import { IUILanguageAwareProps } from "../../react_components/l10n";
import WebSocketManager from "../../utils/WebSocketManager";

interface IPreviewProps extends IUILanguageAwareProps {
    websocketClientContext: string;
}

interface IComponentState {
    previewSrc: string;
}
// This component shows a simulated device with a live epub inside of it.
// The preview lives in an iframe and is activated by setting the src of the iframe
// by broadcasting a message on the web socket. The message should have id 'preview'
// and the "message" should be the URL for the preview iframe. An empty string may be broadcast
// to clear the preview.
export default class EpubPreview extends React.Component<
    IPreviewProps,
    IComponentState
> {
    constructor(props) {
        super(props);
        WebSocketManager.addListener(props.websocketClientContext, e => {
            if (e.id === "epubPreview") {
                this.setState({ previewSrc: e.message });
            }
        });
        this.state = { previewSrc: "" };
    }
    public render() {
        return (
            <div id="device">
                <iframe src={this.state.previewSrc} />
            </div>
        );
    }
}
