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
