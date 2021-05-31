var csrfFieldName = 'CSRF-TOKEN-ELF-FORM';
function ajaxPostWithCSRFToken(url, pData, funcSuccess) {
    var options = {
        type: 'POST',
        url: url,
        headers: {},
        data: pData,
        success: function (data) {
            funcSuccess(data);
        },
        dataType: 'json'
    };
    options.headers['XSRF-TOKEN'] = $(`input[name=${csrfFieldName}]`).val();
    $.ajax(options);
}

function deleteLink(linkId) {
    ajaxPostWithCSRFToken('/admin/delete', { linkId: linkId }, function (data) {
        toastr.success("Link deleted.");
    });
}