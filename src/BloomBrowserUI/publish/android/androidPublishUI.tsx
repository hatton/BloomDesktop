﻿// Mostly updated to https://www.figma.com/file/Lq8CwuPq7GDfolDkI7y0OuWJ/Publish---Android?node-id=0%3A1.
// Todo (future cards):
// - implement motion book preview
// - implement Refresh button
// - link i "Choose landscape to activate motion book mode" & implement (& restrict to when book has that)
// - add About Bloom Reader help link
// - "Get Bloom Reader" add icon
// - one day: longer rounded rectangles for page turner buttons?
// - Can we clean up styles any more before changing epub window to match?
// - Design & implement audio and other controls such as pause, volume, font size (& choice?), auto-play, show image descriptions, play image descriptions,...
// - further UI review, some areas may not match mockup, especially the right column
// Todo (before merge)
// - Hide Bloom Reader Bookshelf
// - preview title should stretch
// - do something about focus rectangle in portrait/landscape buttons
// - move page turners inside page;
// - take out bookshelf
// - rename publishCommon previewCommon; limit it to things related to the actual box containing the preview
// - make a separate file for the rules that actually define the frame outline.
// - change Narration from static methods to instance; give player an instance.
// - improve appearance of preview buttons; try for an automatically-shrunk actual copy of the phone.
import axios from "axios";
import { BloomApi } from "../../utils/bloomApi";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ProgressBox from "../../react_components/progressBox";
import BloomButton from "../../react_components/bloomButton";
import { Checkbox } from "../../react_components/checkbox";
import { ColorChooser } from "../../react_components/colorChooser";
import Option from "../../react_components/option";
import Link from "../../react_components/link";
import HelpLink from "../../react_components/helpLink";
import HtmlHelpLink from "../../react_components/htmlHelpLink";
import {
    H1,
    H2,
    Div,
    IUILanguageAwareProps
} from "../../react_components/l10nComponents";
import WebSocketManager from "../../utils/WebSocketManager";
// this whole file will be removed, but for now, remove this side effect of it existing import "./androidPublishUI.less";
import "errorHandler";

const kWebSocketLifetime = "publish-android";

interface IState {
    method: string;
    stateId: string;
    bookCoverColor: string;
    motionBookMode: boolean;
    landscapePreviewMode: boolean;
    // Url (local, through our file server) of the folder where we put the
    // files which are ready to assemble into a .bloomd.
    previewUrl: string;
    previewPaused: boolean;
    // For motion books, this will always be false. It is only true when
    // a fixed orientation book is displayed in the wrong orientation.
    rotateBook: boolean; // book needs to be rotated to match preview orientation
    bookIsLandscape: boolean; // book is naturally landscape
    bookCanRotate: boolean; // book can reformat itself to match preview orientation
}

// This is a screen of controls that gives the user instructions and controls
// for pushing a book to a connected Android device running Bloom Reader.
class AndroidPublishUI extends React.Component<IUILanguageAwareProps, IState> {
    private isLinux: boolean;
    public readonly state: IState = {
        stateId: "stopped",
        method: "wifi",
        bookCoverColor: "#FFFFFF",
        motionBookMode: false,
        landscapePreviewMode: false,
        previewUrl: "",
        previewPaused: false,
        rotateBook: false,
        bookIsLandscape: false,
        bookCanRotate: false
    };

    public constructor(props: IUILanguageAwareProps) {
        super(props);

        this.isLinux = this.getIsLinuxFromUrl();
        //Todo: remove this comment or reinstate the code (test)
        // enhance: For some reason setting the callback to "this.handleUpdate" calls handleUpdate()
        // with "this" set to the button, not this overall control.
        // I don't quite have my head around this problem yet, but this oddity fixes it.
        // See https://medium.com/@rjun07a/binding-callbacks-in-react-components-9133c0b396c6
        //this.handleUpdateState = this.handleUpdateState.bind(this);

        WebSocketManager.addListener(kWebSocketLifetime, e => {
            if (e.id === "publish/android/state") {
                this.handleUpdateState(e.message || "");
            }
        });

        BloomApi.get("publish/android/method", result => {
            this.setState({ method: result.data });
        });
        BloomApi.get("publish/android/backColor", result =>
            this.setState({ bookCoverColor: result.data })
        );
        BloomApi.get("publish/android/motionBookMode", result =>
            this.setState({ motionBookMode: result.data })
        );
        WebSocketManager.addListener(kWebSocketLifetime, e => {
            if (e.id === "androidPreview" && e.message) {
                this.setState({ previewUrl: e.message });
            }
        });
    }

    private readyToReceiveProgress() {
        // once the progress box is ready, we can start generating a preview.
        // If we don't wait for that, it's pretty random whether we get the
        // "preparing preview" message.
        BloomApi.postData("publish/android/updatePreview", this.state);
    }

    public componentDidMount() {
        window.addEventListener("beforeunload", this.componentCleanup);
        // This receives a message sent from the bloom player in the preview iframe.
        // When the player has read enough of the book to know whether it can rotate
        // and whether its preferred orientation is landscape it sends this message
        // so the preview can be adjusted accordingly.
        window.addEventListener("message", event => {
            this.gotBookProps(event.data);
        });
    }

    // Apparently, we have to rely on the window event when closing or refreshing the page.
    // componentWillUnmount will not get called in those cases.
    public componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener("beforeunload", this.componentCleanup);
    }

    private componentCleanup() {
        BloomApi.post("publish/android/cleanup", result => {
            WebSocketManager.closeSocket(kWebSocketLifetime);
        });
    }

    private handleUpdateState(s: string): void {
        this.setState({ stateId: s });
        //console.log("this.state is " + JSON.stringify(this.state));
    }

    private getIsLinuxFromUrl(): boolean {
        const searchString = window.location.search;
        const i = searchString.indexOf("isLinux=");
        if (i >= 0) {
            return searchString.substr(i + "isLinux=".length, 4) === "true";
        }
        return false;
    }

    private onCopy() {
        // Yes, this is a hack. I simply could not get the client to populate the clipboard.
        // I tried using react-copy-to-clipboard, but kept getting runtime errors as if the component was not found.
        // I tried using document.execCommand("copy"), but though it worked in FF and Chrome, it did not work in Bloom.
        BloomApi.postDataWithConfig(
            "publish/android/textToClipboard",
            document.getElementById("progress-box")!.innerText, // want to crash here if no progress box
            { headers: { "Content-Type": "text/plain" } }
        );
    }

    public render() {
        return (
            <div id="androidPublishReactRoot" className="screen-root">
                <header>
                    <Div
                        className={"intro"}
                        l10nKey="PublishTab.Android.Intro"
                        l10nComment="This is displayed at the top of the Android screen."
                    >
                        Send Your Book to the Bloom Reader Android App
                    </Div>
                </header>
                <div className="main-contents in-row">
                    <div className="sections in-column left-column">
                        <section className="preview-section in-column">
                            <H1 l10nKey="PublishTab.Android.Preview">
                                Preview
                            </H1>
                            <div className="preview-row">
                                <div className="device-square">
                                    <div
                                        className={
                                            "device" +
                                            (this.state.landscapePreviewMode
                                                ? " landscape"
                                                : "") +
                                            (this.state.rotateBook
                                                ? " rotated"
                                                : "")
                                        }
                                    >
                                        <div className="preview-content">
                                            <iframe
                                                src={
                                                    "../../bloom-player/dist/bloomplayer.htm?url=" +
                                                    this.state.previewUrl
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-button-column">
                                    <div>
                                        <div className="preview-orientation-row device-square">
                                            <div
                                                className={
                                                    "device-sizer" +
                                                    (this.state
                                                        .landscapePreviewMode
                                                        ? ""
                                                        : " active")
                                                }
                                            >
                                                <div
                                                    className={
                                                        "device portrait-device" +
                                                        // We need to rotate the preview in a portrait button
                                                        // if the book is landscape, unless it can re-arrange its own
                                                        // contents.
                                                        (this.state
                                                            .bookIsLandscape &&
                                                        !this.state
                                                            .bookCanRotate
                                                            ? " rotated"
                                                            : "")
                                                    }
                                                >
                                                    <div
                                                        id="portrait-button"
                                                        className={
                                                            "orientation-button portrait-button preview-content"
                                                        }
                                                        onClick={() =>
                                                            this.setState({
                                                                landscapePreviewMode: false,
                                                                rotateBook:
                                                                    !this.state
                                                                        .bookCanRotate &&
                                                                    this.state
                                                                        .bookIsLandscape
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "device-sizer" +
                                                    (this.state
                                                        .landscapePreviewMode
                                                        ? " active"
                                                        : "")
                                                }
                                            >
                                                <div
                                                    className={
                                                        "device landscape-device landscape" +
                                                        // in the landscape button we need to rotate the preview
                                                        // if the book is a portrait one (that can't rotate itself)
                                                        (!this.state
                                                            .bookIsLandscape &&
                                                        !this.state
                                                            .bookCanRotate
                                                            ? " rotated"
                                                            : "")
                                                    }
                                                >
                                                    <div
                                                        id="landscape-button"
                                                        className="orientation-button landscape-button preview-content"
                                                        onClick={() =>
                                                            this.setState({
                                                                landscapePreviewMode: true,
                                                                rotateBook:
                                                                    !this.state
                                                                        .bookCanRotate &&
                                                                    !this.state
                                                                        .bookIsLandscape
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                "image-text-row choose-landscape" +
                                                (this.showChooseLandscapeMessage()
                                                    ? ""
                                                    : " hidden")
                                            }
                                        >
                                            <div className="inline-text-icon info-icon">
                                                <span>i</span>
                                            </div>
                                            <Div l10nKey="PublishTab.Android.ChooseLandscapeForMotion">
                                                Choose landscape to activate
                                                Motion Book mode
                                            </Div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            "image-text-row preview-refresh" +
                                            (this.state.landscapePreviewMode
                                                ? " landscape"
                                                : "")
                                        }
                                    >
                                        <img
                                            className="inline-text-icon"
                                            src="Ic_refresh_48px.svg"
                                        />
                                        <Div
                                            l10nKey="Common.Refresh"
                                            onClick={() =>
                                                this.refreshPreview()
                                            }
                                        >
                                            Refresh
                                        </Div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="publish-section in-column">
                            <H1 l10nKey="PublishTab.Android.Publish">
                                Publish
                            </H1>
                            <div className="publish-contents in-row">
                                <div className="publish-controls-column">
                                    <H2
                                        l10nKey="PublishTab.Android.Method"
                                        l10nComment="There are several methods for pushing a book to android. This is the heading above the chooser."
                                    >
                                        Choose how to send to device
                                    </H2>
                                    {/* This wrapper, with some really tricky CSS, serves to make a select where the options have both text
                                and images, and the down arrow is a dark black on a plain white background with a black line left of it.
                                1. The outer div provides the outer border and, by means of a background image, both the down arrow
                                and the vertical line to the left of it.
                                2. The normal down arrow in the select is hidden by moz-appearance: none.
                                3. The outer div's background is allowed to show through the select by background-color: transparent.
                                4. A class for each option brings in the appropriate background image. One of these classes is
                                applied to the select itself by the react logic so the right image shows up there too.

                                We can't just put a background image on the select to get the down arrow, because we're already
                                using its background image to get the image that goes with the selected option.
                                I can't find a way to get a border between the select and the button without making the select
                                smaller, and then the down-arrow is not part of it and doesn't trigger the select action.
                                Modern browsers do not allow code to trigger the pulling down of the select list...it's
                                somehow considered a security risk, so we can't just put a click action on the button.

                                Note: when the select has focus, the dotted focus outline is drawn around the text rather
                                than the whole select, putting a distracting line between the text and picture. For some reason
                                Firefox is drawing this inside the padding that is used to put the text at the top instead of
                                centered in the select. I've tried things that should turn the focus outline off, like
                                :focus {outline: none !important} and -moz-focusring {color: transparent; text-shadow: 0 0 0 #000;}
                                but they didn't make any difference. I've tried various things, including messing with the text
                                baseline and applying properties to the span that FF creates inside each option, to move the
                                text to the top without padding, but with no success. We decided to live with the dotted line
                                rather than spending more time trying to remove it (or re-implementing the control without
                                using a select, probably the most promising way to get exactly what we want.)

                                This approach does not work in FF 56 (no images in the options) so we will probably eventually
                                have to re-implement without using select.
                                */}
                                    <div className="method-select-wrapper">
                                        <select
                                            className={`method-shared method-root ${
                                                this.state.method
                                            }-method-option`}
                                            disabled={
                                                this.state.stateId !== "stopped"
                                            }
                                            value={this.state.method}
                                            onChange={event => {
                                                this.setState({
                                                    method: event.target.value
                                                });
                                                BloomApi.wrapAxios(
                                                    axios.post(
                                                        "/bloom/api/publish/android/method",
                                                        event.target.value,
                                                        {
                                                            headers: {
                                                                "Content-Type":
                                                                    "text/plain"
                                                            }
                                                        }
                                                    )
                                                );
                                            }}
                                        >
                                            <Option
                                                l10nKey="PublishTab.Android.ChooseWifi"
                                                className="method-shared wifi-method-option"
                                                value="wifi"
                                            >
                                                Serve on WiFi Network
                                            </Option>
                                            <Option
                                                l10nKey="PublishTab.Android.ChooseUSB"
                                                className="method-shared usb-method-option"
                                                value="usb"
                                            >
                                                Send over USB Cable
                                            </Option>
                                            <Option
                                                l10nKey="PublishTab.Android.ChooseFile"
                                                className="method-shared file-method-option"
                                                value="file"
                                            >
                                                Save Bloom Reader File
                                            </Option>
                                        </select>
                                    </div>
                                    <H1
                                        l10nKey="PublishTab.Android.Control"
                                        l10nComment="This is the heading above various buttons that control the publishing of the book to Android."
                                    >
                                        Send or Save
                                    </H1>
                                    {this.state.method === "wifi" && (
                                        <div>
                                            <BloomButton
                                                l10nKey="PublishTab.Android.Wifi.Start"
                                                l10nComment="Button that tells Bloom to begin offering this book on the wifi network."
                                                enabled={
                                                    this.state.stateId ===
                                                    "stopped"
                                                }
                                                clickApiEndpoint="publish/android/wifi/start"
                                                hasText={true}
                                            >
                                                Share
                                            </BloomButton>
                                            <BloomButton
                                                l10nKey="PublishTab.Android.Wifi.Stop"
                                                l10nComment="Button that tells Bloom to stop offering this book on the wifi network."
                                                enabled={
                                                    this.state.stateId ===
                                                    "ServingOnWifi"
                                                }
                                                clickApiEndpoint="publish/android/wifi/stop"
                                                hasText={true}
                                            >
                                                Stop Serving
                                            </BloomButton>
                                        </div>
                                    )}
                                    {this.state.method === "usb" && (
                                        <div>
                                            <BloomButton
                                                l10nKey="PublishTab.Android.Usb.Start"
                                                l10nComment="Button that tells Bloom to send the book to a device via USB cable."
                                                enabled={
                                                    this.state.stateId ===
                                                    "stopped"
                                                }
                                                clickApiEndpoint="publish/android/usb/start"
                                                hidden={this.isLinux}
                                                hasText={true}
                                            >
                                                Connect with USB cable
                                            </BloomButton>

                                            <BloomButton
                                                l10nKey="PublishTab.Android.Usb.Stop"
                                                enabled={
                                                    this.state.stateId ===
                                                    "UsbStarted"
                                                }
                                                clickApiEndpoint="publish/android/usb/stop"
                                                hasText={true}
                                            >
                                                Stop Trying
                                            </BloomButton>
                                        </div>
                                    )}
                                    {this.state.method === "file" && (
                                        <div>
                                            <BloomButton
                                                l10nKey="PublishTab.Save"
                                                l10nComment="Button that tells Bloom to save the book as a .bloomD file."
                                                clickApiEndpoint="publish/android/file/save"
                                                enabled={true}
                                                hasText={true}
                                            >
                                                Save...
                                            </BloomButton>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="progress-column in-column"
                                    style={{ visibility: "visible" }}
                                >
                                    <H2 l10nKey="Common.Progress">Progress</H2>
                                    <ProgressBox
                                        clientContext={kWebSocketLifetime}
                                        onReadyToReceive={() =>
                                            this.readyToReceiveProgress()
                                        }
                                        progressBoxId="progress-box"
                                    />
                                    <Link
                                        id="copyProgressToClipboard"
                                        href=""
                                        l10nKey="PublishTab.Android.CopyToClipboard"
                                        onClick={this.onCopy}
                                    >
                                        Copy to Clipboard
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="sections in-column right-column">
                        <section className="settings-section">
                            <H1 l10nKey="PublishTab.Android.Settings">
                                Settings
                            </H1>
                            <div className="right-column-subsection">
                                <Div
                                    l10nKey="PublishTab.Android.Thumbnail"
                                    className="settings-subheading"
                                >
                                    Thumbnail
                                </Div>
                                <ColorChooser
                                    menuLeft={true}
                                    imagePath="/bloom/api/publish/android/thumbnail?color="
                                    backColorSetting={this.state.bookCoverColor}
                                    onColorChanged={colorChoice => {
                                        BloomApi.postDataWithConfig(
                                            "publish/android/backColor",
                                            colorChoice,
                                            {
                                                headers: {
                                                    "Content-Type": "text/plain"
                                                }
                                            },
                                            //wait until it's set because once the state changes, a
                                            // new image gets requested and we want that to happen
                                            // only after the server has registered this change.
                                            () =>
                                                this.setState({
                                                    bookCoverColor: colorChoice
                                                })
                                        );
                                    }}
                                />
                            </div>
                            <div className="right-column-subsection">
                                <Div
                                    l10nKey="PublishTab.Android.Features"
                                    className="settings-subheading"
                                >
                                    Features
                                </Div>
                                <div className="check-with-help">
                                    <Checkbox
                                        id="motionBookModeCheckbox"
                                        wrapClassName="motionBookModeCheckbox"
                                        name="motionBookMode"
                                        l10nKey="PublishTab.Android.MotionBookMode"
                                        // tslint:disable-next-line:max-line-length
                                        l10nComment="Motion Books are Talking Books in which the picture fils the screen, then pans and zooms while you hear the voice recording. This happens only if you turn the book sideways."
                                        checked={this.state.motionBookMode}
                                        onCheckChanged={checked => {
                                            this.setState({
                                                motionBookMode: checked
                                            });
                                            BloomApi.postDataWithConfig(
                                                "publish/android/motionBookMode",
                                                checked,
                                                {
                                                    headers: {
                                                        "Content-Type":
                                                            "text/plain"
                                                    }
                                                }
                                            );
                                        }}
                                    >
                                        Motion Book
                                    </Checkbox>
                                    <div className="aboutMotionLink">
                                        <a href="/bloom/api/help/Concepts/Motion_Book.htm">
                                            <i
                                                className="fa fa-question-circle-o"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>{" "}
                        </section>
                        <section style={{ display: "none" }}>
                            {/*
                            <section className="publishSection right-column">
                                <H1 l10nKey="PublishTab.Android.Bookshelf">
                                    Bloom Reader Bookshelf
                                </H1>
                                <div style={{ marginBottom: "1em" }}>
                                    Coming soon we hope...
                                </div>
                            </section>
                            */}
                        </section>
                        <section className="help-section">
                            <H1 l10nKey="Common.Help">Help</H1>
                            <div className="right-column-subsection">
                                <HelpLink
                                    l10nKey="PublishTab.Android.AboutBloomReader"
                                    helpId="Concepts/Bloom_Reader_App.htm"
                                >
                                    About Bloom Reader
                                </HelpLink>
                                <HtmlHelpLink
                                    l10nKey="PublishTab.Android.Troubleshooting"
                                    fileid="Publish-Android-Troubleshooting"
                                >
                                    Troubleshooting Tips
                                </HtmlHelpLink>
                                <div className="icon-link-row get-bloom-reader">
                                    <a href="https://play.google.com/store/search?q=%22sil%20international%22%2B%22bloom%20reader%22&amp;c=apps">
                                        <img
                                            className="playIcon"
                                            src="Google_Play_symbol_2016.svg"
                                        />
                                    </a>
                                    <Link
                                        id="getBloomReaderLink"
                                        href="https://play.google.com/store/search?q=%22sil%20international%22%2B%22bloom%20reader%22&amp;c=apps"
                                        l10nKey="PublishTab.Android.GetBloomReader"
                                        l10nComment="Link to find Bloom Reader on Google Play Store"
                                    >
                                        Get Bloom Reader App
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="bottom-scroll-shim" />
            </div>
        );
    }

    private showChooseLandscapeMessage(): boolean {
        if (this.state.landscapePreviewMode) {
            return false; // already in landscape, not needed.
        }
        if (!this.state.motionBookMode) {
            // review: if it's turned off, landscape won't help, but maybe they need
            // even more help to discover the two-step process of turning it on
            // and going to landscape? (Maybe Refresh too?)
            return false;
        }
        // review: should we only show this (and only enable the Motion Book checkbox?)
        // if the book has some images marked up for motion?
        return true;
    }

    private gotBookProps(props: {
        landscape: boolean;
        canRotate: boolean;
    }): void {
        // We got this information about (typically) a new book.
        // As well as recording what we learned about the book, we will force our
        // preview into the natural orientation for the book, which means it
        // is NOT now rotated to the other orientation (so rotateBook is always false).
        this.setState({
            landscapePreviewMode: props.landscape,
            bookIsLandscape: props.landscape,
            rotateBook: false,
            bookCanRotate: props.canRotate
        });
    }

    private refreshPreview(): void {
        // todo: implement.
    }
}

// a bit goofy... currently the html loads everying in publishUIBundlejs. So all the publish screens
// get any not-in-a-class code called, including ours. But it only makes sense to get wired up
// if that html has the root page we need.
if (document.getElementById("AndroidPublishUI")) {
    ReactDOM.render(
        <AndroidPublishUI />,
        document.getElementById("AndroidPublishUI")
    );
}
