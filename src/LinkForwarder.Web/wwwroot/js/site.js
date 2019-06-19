var csrfFieldName = 'CSRF-TOKEN-LFWDR-FORM';
function makeCSRFExtendedData(data) {
    var options = {};
    options[csrfFieldName] = $("input[name=" + csrfFieldName + "]").val();
    var extData = $.extend(data, options);
    return extData;
}

function ajaxPostWithCSRFToken(url, pData, funcSuccess) {
    var options = {
        type: 'POST',
        url: url,
        headers: {},
        data: makeCSRFExtendedData(pData),
        success: function (data) {
            funcSuccess(data);
        },
        dataType: 'json'
    };
    options.headers[csrfFieldName] = $("input[name=" + csrfFieldName + "]").val();
    $.ajax(options);
}

function deleteLink(linkId) {
    ajaxPostWithCSRFToken('/link/delete', { linkId: linkId }, function (data) {
        toastr.success("Link deleted.");
    });
}

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}