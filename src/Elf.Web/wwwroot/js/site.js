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
        elfToast.success("Link deleted.");
    });
}

var bsToast = new bootstrap.Toast(document.getElementById('liveToast'));
var elfToast = {
    success: function (message) {
        $('#liveToast').removeClass('bg-success bg-warning bg-danger bg-info bg-primary bg-secondary');
        $('#liveToast').addClass('bg-success');
        $('#blogtoast-message').html(message);
        bsToast.show();
    },
    info: function (message) {
        $('#liveToast').removeClass('bg-success bg-warning bg-danger bg-info bg-primary bg-secondary');
        $('#liveToast').addClass('bg-info');
        $('#blogtoast-message').html(message);
        bsToast.show();
    },
    warning: function (message) {
        $('#liveToast').removeClass('bg-success bg-warning bg-danger bg-info bg-primary bg-secondary');
        $('#liveToast').addClass('bg-warning');
        $('#blogtoast-message').html(message);
        bsToast.show();
    },
    error: function (message) {
        $('#liveToast').removeClass('bg-success bg-warning bg-danger bg-info bg-primary bg-secondary');
        $('#liveToast').addClass('bg-danger');
        $('#blogtoast-message').html(message);
        bsToast.show();
    }
};