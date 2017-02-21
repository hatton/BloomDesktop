'use strict';
///<reference path="../../../typings/axios/axios.d.ts"/>
import axios = require('axios');
import * as JQuery from 'jquery';
import * as $ from 'jquery';

$(document).ready(() => {
    // request our model and set the controls
    axios.get<any>('/bloom/api/book/settings').then(result => {
        var settings = result.data;

        // Only show this if we are editing a shell book. Otherwise, it's already not locked.
        if (!settings.isRecordedAsLockedDown) {
            $(".showOnlyWhenBookWouldNormallyBeLocked").css("display", "none");
            $("input[name='isTemplateBook']").prop("checked", settings.isTemplateBook);
        }
        else {
            $(".showOnlyIfBookIsNeverLocked").css("display", "none");
            // enhance: this is just dirt-poor binding of 1 checkbox for now
            $("input[name='unlockShellBook']").prop("checked", settings.unlockShellBook);
        }
        //REVIEW: why is this needed? What is the minimum time on dev machine? Should fix this.
        window.setTimeout(loadPageOptions, 500);
    });
});

function getPageFrame(): HTMLIFrameElement {
    return <HTMLIFrameElement>parent.window.document.getElementById('page');
}

// The body of the editable page, a root for searching for document content.
function getPage(): JQuery {
    const page = getPageFrame();
    if (!page) {
        return null;
    }
    return $(page.contentWindow.document.body);
}

function loadPageOptions() {
    // for an example of these options, see bloom-xmatter-mixins.jade, search for pageLayoutOptions

    const page = getPage().find(".bloom-page")[0];
    const initialOptions = page.getAttribute("data-page-layout-options") || "";

    const optionDivsFromPageWeAreEditing = $(page).find(".pageLayoutOptions div");
    if (optionDivsFromPageWeAreEditing.length > 0) {
        // clear from the toolbox ui any existing options
        $(".pageLayoutOptions").empty();
        //copy each option from the page into the UI
        optionDivsFromPageWeAreEditing.each((index, element) => {
            const wiredUpOptionControls = $(element).clone(false);

            //load the checkboxes according to the current value of the page's data-page-layout-options
            const key = $(wiredUpOptionControls).data("option");
            const checkbox: HTMLInputElement = <HTMLInputElement>$(wiredUpOptionControls).find('input')[0];
            checkbox.checked = initialOptions.indexOf(key) > -1;

            //when the user clicks on something, update the page's data
            $(wiredUpOptionControls).click((event) => {
                let currentOptions = page.getAttribute("data-page-layout-options") || "";
                currentOptions = currentOptions.replace(key, "").trim();

                if (checkbox.checked) {
                    currentOptions = (currentOptions + " " + key).trim();
                }
                page.setAttribute("data-page-layout-options", currentOptions);
            });

            $(".pageLayoutOptions").append(wiredUpOptionControls);
        });
    }
    loadFieldLanguageOptions();
}

function loadFieldLanguageOptions() {
    const page = getPage().find(".bloom-page")[0];
    const groups = $(page).find(".bloom-translationGroup");
    groups.each((iterator, group) => {
        // at the moment, this is only for ISBN; we *could* allow people to hide it.
        // but it we would need to at least not show all the language variants that
        // some process sticks in there, which don't make sense. For now, I'm just
        // leaving it out of the options.
        if (group.getAttribute("data-default-languages") === "*") {
            return;
        }
        const editables = $(group).find(".bloom-editable");

        // we *could* allow people to turn on/off text blocks in the content of the book,
        // but we're not going there right now.
        if (!group.hasAttribute("data-book") && $(group).children("[data-book]").length === 0) {
            return;
        }
        var groupLabel = group.getAttribute("data-book") || "";
        editables.each((iterator2, editable) => {
            //todo i18n
            var lang = editable.getAttribute("lang");
            //"*" (language unspecified) doesn't really belong in there if it is among others
            if (lang === "*" && editables.length > 1) {
                return;
            }
            // "z" is not a real language; sometimes used for supplying a prototype
            if (lang === "z") {
                return;
            }
            var dataLabelSometimesOnEditable = editable.getAttribute("data-book") || "";
            var label = groupLabel + dataLabelSometimesOnEditable + " : " + lang;
            var checkboxAndLabel = $("<div class='optionCheckbox'><input type='checkbox'></input><label>" + label + "</label></div>");
            var editableIsVisible = $(editable).hasClass("bloom-visibility-user-on") ||
                (!$(editable).hasClass("bloom-visibility-user-off") && $(editable).hasClass("bloom-visibility-code-on"));

            (<HTMLInputElement>checkboxAndLabel.find('input')[0]).checked = editableIsVisible;

            $(checkboxAndLabel).click((event) => {
                editableIsVisible = !editableIsVisible;
                if (editableIsVisible) {
                    $(editable).removeClass("bloom-visibility-user-off");
                    $(editable).addClass("bloom-visibility-user-on");
                } else {
                    $(editable).removeClass("bloom-visibility-user-on");
                    $(editable).addClass("bloom-visibility-user-off");
                }
            });


            $(".pageLayoutOptions").append(checkboxAndLabel);
        });
    });
}

export function handleBookSettingCheckboxClick(clickedButton: any) {
    // read our controls and send the model back to c#
    // enhance: this is just dirt-poor serialization of checkboxes for now
    var inputs = $("#bookSettings :input");
    var o = {};
    var settings = $.map(inputs, (input, i) => {
        o[input.name] = $(input).prop("checked");
        return o;
    })[0];
    axios.post("/bloom/api/book/settings", settings);
}


export function handleResetZoom(clickedButton: any) {
    var pageDom = <HTMLIFrameElement>parent.window.document.getElementById('page');
    var pageBody = $(pageDom.contentWindow.document.body);
    $(pageBody).css('transform', 'scale(' + 1.0 + ',' + 1.0 + ')');
}
