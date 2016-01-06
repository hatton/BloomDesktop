if (typeof ($) === "function") {
    $(document).ready(function () {
        // request our model and set the controls
        getIframeChannel().simpleAjaxGet('/bloom/bookSettings', function (settings) {
            // enhance: this is just dirt-poor binding of 1 checkbox for now
            $("input[name='unlockShellBook']").prop("checked", settings.unlockShellBook);
        });
    });
}
function handleBookSettingCheckboxClick(clickedButton) {
    // read our controls and send the model back to c#
    // enhance: this is just dirt-poor serialization of checkboxes for now
    var inputs = $(".bookSettings :input");
    var settings = $.map(inputs, function (input, i) {
        var o = {};
        o[input.name] = $(input).prop("checked");
        return o;
    })[0];
    bookSettingsFireCSharpEvent("setBookSettings", JSON.stringify(settings));
}
function bookSettingsFireCSharpEvent(eventName, eventData) {
    var event = new MessageEvent(eventName, { 'bubbles': true, 'cancelable': true, 'data': eventData });
    document.dispatchEvent(event);
}
//# sourceMappingURL=bookSettings.js.map