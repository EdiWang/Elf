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

function callApi(uri, method, request, funcSuccess, funcAlways) {
    const csrfValue = $(`input[name=${csrfFieldName}]`).val();
    fetch(uri, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'XSRF-TOKEN': csrfValue
        },
        credentials: 'include',
        body: method === 'GET' ? null : JSON.stringify(request)
    }).then(async (response) => {
        if (!response.ok) {
            await handleHttpError(response);
        } else {
            if (funcSuccess) {
                funcSuccess(response);
            }
        }
    }).then(response => {
        if (funcAlways) {
            funcAlways(response);
        }
    }).catch(err => {
        elfToast.error(err);
        console.error(err);
    });
}

function copyUrl(url) {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    document.body.removeChild(el);
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