import * as React from "react";
import HelpLink from "../../react_components/helpLink";
import { IUILanguageAwareProps } from "../../react_components/l10n";

import "./learnAboutAccessibility.less";

export class LearnAboutAccessibility extends React.Component<
    IUILanguageAwareProps
> {
    public render() {
        return (
            <div>
                <div style={{ width: "5in" }}>
                    <p>
                        "Accessible Books" are books that work well for people
                        with impaired vision. With the{" "}
                        <a href="https://en.wikipedia.org/wiki/EPUB">
                            ePUB format
                        </a>
                        , it is possible to make <em>Born Accessible</em> books
                        that work well for everyone
                        <sup>*</sup>, regardless of vision. Bloom has the
                        following tools to help you create these books:
                    </p>
                    <ul>
                        <li>
                            <HelpLink
                                l10nKey="EditTab.Toolbox.ImageDescriptionTool"
                                helpId="Tasks/Edit_tasks/Image_Description_Tool/Image_Description_Tool_overview.htm"
                            >
                                Image Description Tool
                            </HelpLink>
                        </li>
                        <li>
                            <HelpLink
                                l10nKey="EditTab.Toolbox.TalkingBookTool"
                                helpId="Tasks/Edit_tasks/Record_Audio/Talking_Book_Tool_overview.htm"
                            >
                                Talking Book Tool
                            </HelpLink>
                        </li>
                        <li>
                            <HelpLink
                                l10nKey="EditTab.Toolbox.ImpairmentVisualizer"
                                helpId="Tasks/Edit_tasks/Impairment_Visualizer/Impairment_Visualizer_overview.htm"
                            >
                                Impairment Visualizer
                            </HelpLink>
                        </li>
                        <li>
                            This tool, the Accessibility Checker, has:
                            <ul>
                                <li>
                                    <b>The Accessibility Checklist</b> which is
                                    where Bloom checks over your book and points
                                    you to anything that needs attention,
                                    especially for speakers of minority
                                    languages.
                                </li>
                                <li>
                                    <b>The Ace by Daisy Checker</b> searches the
                                    actual ePUB generated by Bloom looking for
                                    any problems.
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p style={{ backgroundColor: "#f5e2e5", padding: "10px" }}>
                        <sup style={{ fontSize: "14pt" }}>*</sup>
                        While the ideal is that a single book can serve
                        everyone, the ePUB standard and ePUB readers do not
                        actually support that. They currently only work for
                        blind people who speak a language that is supported by
                        "Text to Speech" (TTS) systems. At this time, TTS is
                        only available for large or commercially interesting
                        languages. Until the standard and accessible readers
                        improve, it is necessary to make special versions of
                        accessible books for minority language speakers. For
                        blind readers to hear the image descriptions, we need to
                        put something special on the page. In this version of
                        Bloom, you do this by clicking the "Include image
                        descriptions on page" checkbox in the Publish:ePUB
                        screen. Future versions may have other options in this
                        area.
                    </p>
                    <div
                        style={{
                            backgroundColor: "lightgrey",
                            padding: "10px"
                        }}
                    >
                        <p>
                            TO DO We would like to point folks to things that
                            Bloom can't handle automatically that you should
                            think about. However, most of the online literature
                            about accessible books is about technical things
                            that Bloom takes care of for you.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
