//"use strict"

const OrderDirection = Object.freeze({ "Asc": 0, "Desc": 1 });

const LogicType = Object.freeze({ "None": 0, "Not": 1, "And": 2, "Or": 3 });

const OperatorType = Object.freeze(
    {
        "Equal": 1,
        "NotEqual": 2,
        "Greater": 3,
        "GreaterThanEqual": 4,
        "Lower": 5,
        "LowerThanEqual": 6,
        "Contain": 7,
        "StartWith": 8,
        "EndWith": 9,
        "In": 10,
        "NotIn": 11,
        "IsNull": 12,
        "IsNotNull": 13,
        "ContainIn": 14
    }
);

class PageInfo {
    constructor(pageIndex, pageSize) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }
}

class JobResult {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
}

class Sort {
    constructor(field, orderDirection) {
        this.field = field;
        this.orderDirection = orderDirection || OrderDirection.Asc;
    }
}

class Filter {
    constructor(logic, field, operator, value, filters) {
        this.logic = logic || LogicType.None;
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.filters = filters || null;
    }
}

class PagingRequest {
    constructor(pageInfo, sorts, filters, fields) {
        this.pageInfo = pageInfo;
        this.sorts = sorts;
        this.filters = filters;
        this.fields = fields || null;
    }
}


//todo js
var SwalMsgType = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    question: 'question',
};

var CommonJs = {
    //Limit size for upload file (25MB)
    LimitFileSize: 25 * 1024 * 1024,
    //Size of piece file to use ResumableUpload (2MB)
    chunkSize: 2 * 1024 * 1024,
    CustAjaxCall: function (someData, method, url, datatype, ssCallBack, errCallback) {
        $.ajax({
            async: false,
            data: someData,
            method: method,
            dataType: datatype, //'json'
            url: url, //'/controller/action/'
            beforeSend: CommonJs.LazyLoadAjax,

        }).done(function (data) {
            // If successful
            if (typeof (ssCallBack) === "function")
                ssCallBack(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If fail
            alert(textStatus + ': ' + errorThrown);
            if (typeof (errCallback) === "function") {
                errCallback();
            }
        });
    },
    ShowModalExtra: function () {
        $("#modal-xl").modal('show');
    },
    ShowModalSm: function () {
        $("#modal-sm").modal('show');
    },
    //https://sweetalert2.github.io/
    ShowErrMsg: function (msgContent) {
        Swal.fire({
            icon: 'error',
            title: 'Thông báo',
            text: msgContent,
            timer: 5000,
            showConfirmButton: false,
            position: 'bottom-end',
            toast: true, 
            showCloseButton: true
        });
    },

    ShowNotifyMsg: function (res) {
        let icon = 'info';
        let msgContent = '';
        let bgColor = '#3498db';

        if (res !== undefined) {
            if (res.success) {
                icon = 'success';
                msgContent = res.message ?? 'Thành công';
                bgColor = '#28a745'; // xanh lá
            } else {
                icon = 'error';
                msgContent = res.message ?? 'Thất bại';
                bgColor = '#dc3545'; // đỏ
            }

            Swal.fire({
                icon: icon,
                title: 'Thông báo',
                text: msgContent,
                timer: 3000,
                showConfirmButton: false,
                position: 'bottom-end',
                toast: true,
                showCloseButton: true,
                background: bgColor,
                color: '#fff',
                customClass: {
                    popup: 'colored-toast'
                }
            });
        }
        return false;
    },


    /**
     * Showing Sweetalert
     * @param {string} title Title of message box
     * @param {string} text Content of message box
     * @param {string} confirmText Text show on Confirm button
     * @param {string} cancelText Text show on Cancel button
     * @param {function} callbackFunc Callback funtion
     */
    ShowConfirmMsg: function (title, text, confirmText, cancelText, callbackFunc) {
        Swal.fire({
            titleText: title.slice(title.length - 5) === '.pdf?' || title.slice(title.length - 5) === '.jpg?' || title.slice(title.length - 6) === '.jpeg?' || title.slice(title.length - 5) === '.png?' && title.length > 40 ? title.slice(0, 16) + "..." + title.slice(title.length - 15, title.length) : title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            reverseButtons: true,
            focusConfirm: false,
            focusCancel: true,
            showCloseButton: true,
            confirmButtonText: '<i class="fas fa-fw fa-trash-alt"></i>' + (confirmText || "Xóa"),
            cancelButtonText: '<i class="fas fa-fw fa-times"></i>' + (cancelText || "Đóng"),
            customClass: {
                confirmButton: 'btn btn-basic btn-delete m-1',
                cancelButton: 'btn btn-basic btn-close m-1',
                popup: 'modal-draggable'
            },

        }).then((res) => {
            if (res.value) {
                if (typeof (callbackFunc) === "function") {
                    callbackFunc();
                }
            }
        })
    },
    ShowConfirmMsg2: function (title, text, confirmText, cancelText, callbackFunc, url) {
        Swal.fire({
            titleText: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            reverseButtons: true,
            focusConfirm: false,
            focusCancel: true,
            showCloseButton: true,
            confirmButtonText: '<i class="fas fa-fw fa-check"></i>' + (confirmText || "Đồng ý"),
            cancelButtonText: '<i class="fas fa-fw fa-times"></i>' + (cancelText || "Đóng"),
            customClass: {
                confirmButton: 'btn btn-basic btn-save m-1',
                cancelButton: 'btn btn-basic btn-close m-1',
                popup: 'modal-draggable'
            },
        }).then((res) => {
            if (res.value) {
                if (typeof (callbackFunc) === "function") {
                    callbackFunc();
                }
            }
        })
    },
    ShowConfirmMsgNote: function (title, text, confirmText, cancelText, callbackFunc) {
        Swal.fire({
            titleText: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            reverseButtons: true,
            focusConfirm: false,
            focusCancel: true,
            showCloseButton: true,
            confirmButtonText: '<i class="fas fa-fw fa-check"></i>' + (confirmText || "Đồng ý"),
            cancelButtonText: '<i class="fas fa-fw fa-times"></i>' + (cancelText || "Đóng"),
            customClass: {
                confirmButton: 'btn btn-basic btn-save m-1',
                cancelButton: 'btn btn-basic btn-close m-1',
                popup: 'modal-draggable'
            },
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder: LocalizerSource.InputReason,
                rows: 3
            },
            preConfirm: (Reason) => {
                if (CommonJs.IsEmpty(Reason)) {
                    Swal.showValidationMessage(LocalizerSource.PlzInputReason)
                }
                return Reason;
            },
        }).then((res) => {
            if (res.value) {
                if (typeof (callbackFunc) === "function") {
                    callbackFunc(res.value);
                }
            }
        })
    },
    ShowConfirmCheckBox: function (title, text, confirmText, cancelText, checkboxText, checkboxValue, callbackFunc) {
        Swal.fire({
            titleText: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            reverseButtons: true,
            focusConfirm: false,
            focusCancel: true,
            showCloseButton: true,
            confirmButtonText: '<i class="fas fa-fw fa-check"></i>' + (confirmText || "Đồng ý"),
            cancelButtonText: '<i class="fas fa-fw fa-times"></i>' + (cancelText || "Đóng"),
            customClass: {
                confirmButton: 'btn btn-basic btn-save m-1',
                cancelButton: 'btn btn-basic btn-close m-1',
                popup: 'modal-draggable'
            },
            input: 'checkbox',
            inputPlaceholder: checkboxText,
            inputValue: checkboxValue,
            //inputAttributes: {
            //    autocapitalize: 'off',
            //    placeholder: 'Nhập lý do',
            //    rows: 3
            //},
            preConfirm: (isChecked) => {
                console.log(isChecked > 0);
                return String(isChecked > 0);
            },
        }).then((res) => {
            if (res.value) {
                if (typeof (callbackFunc) === "function") {
                    callbackFunc(res.value);
                }
            }
        })
    },

    QuickSubmitJS: function () {
        $(".QuickSubmitJS").click(function () {
            let self = $(this);
            let form = self.closest("form");
            let data = CommonJs.GetSerialize(form);
            let url = self.attr("data-url");
            let dataType = "json";
            let isReload = self.attr("isReloadAfterSubmit") !== "false";
            let ssCallBack = function (res) {
                if (typeof res === "object" && typeof res.type !== undefined) {
                    if (res.success) {
                        if (isReload) {
                            setTimeout(function () {
                                window.location.reload();
                            }, 3000);
                        }
                        CommonJs.ShowNotifyMsg(res);
                    }
                    else {
                        CommonJs.ShowNotifyMsg(res);
                    }
                }
            }

            //todo : handle with errCallback
            let errCallback = function () {
                return false;
            }

            CommonJs.CustAjaxCall(data, "POST", url, dataType, ssCallBack, errCallback);
            return false;
        });
    },
    QuickSubmitHTML: function () {
        $(".QuickSubmitHtml").click(function () {
            let self = $(this);
            let form = self.closest("form");
            let data = form.serializeArray();
            let nOb = {};
            for (let i in data) {
                if (!nOb.hasOwnProperty(data[i].name))
                    nOb[data[i].name] = "";
                nOb[data[i].name].push(data[i].value);
            }

            let url = self.attr("data-url");
            let dataType = "html"
            let dataTarget = self.attr("data-target");
            let ssCallBack = function (res) {
                $(dataTarget).html(res);
            }

            //todo : handle with errCallback
            let errCallback = function () {
                return;
            }

            CommonJs.CustAjaxCall(data, url, dataType, ssCallBack, errCallback);
        });
    },
    GetFilterFromTextBox: function (elTextBox, filters) {
        let lstField = elTextBox.attr('data-field-search');
        let name = elTextBox.attr('name');
        let arrField = [];
        if (lstField) {
            arrField = arrField.concat((lstField == undefined || lstField == '') ? ['Name'] : lstField.split(','));
        } else {
            arrField = [];
        }

        if (arrField.length > 0) {
            let newfilter = new Filter(null, null, null, null);
            if (filters.length <= 0) {
                newfilter.filters = [];
                arrField.forEach((entry, index) => {
                    if (index == 0) {
                        newfilter.filters.push(new Filter(null, entry, OperatorType.Contain, elTextBox.val()));
                    } else {
                        newfilter.filters.push(new Filter(LogicType.Or, entry, OperatorType.Contain, elTextBox.val()));
                    }
                });

            } else {
                newfilter = new Filter(LogicType.And, null, null, null);
                newfilter.filters = [];
                arrField.forEach((entry, index) => {
                    if (index == 0) {
                        newfilter.filters.push(new Filter(null, entry, OperatorType.Contain, elTextBox.val()));
                    } else {
                        newfilter.filters.push(new Filter(LogicType.Or, entry, OperatorType.Contain, elTextBox.val()));
                    }
                });
            }
            filters.push(newfilter);

        } else {
            if (filters.length <= 0) {
                filters.push(new Filter(null, name, OperatorType.Contain, elTextBox.val()));
            } else {
                filters.push(new Filter(LogicType.And, name, OperatorType.Contain, elTextBox.val()));
            }
        }

    },
    GetFilterFromSelect: function (elSelect, filters) {
        if (elSelect.val() != "-1") {
            let operatorType = OperatorType.Equal;
            let val = elSelect.val();
            if (elSelect.attr("data-operator")) {
                operatorType = elSelect.attr("data-operator");
            }
            if (val.trim().length == 0) {
                val = "";
                operatorType = OperatorType.Equal;
            }
            if (operatorType == OperatorType.ContainIn) {
                var vals = val.split(',');
                if (vals.length == 1) {
                    if (filters.length <= 0) {
                        filters.push(new Filter(null, elSelect.attr("name"), OperatorType.Contain, val));
                    } else {
                        filters.push(new Filter(LogicType.And, elSelect.attr("name"), OperatorType.Contain, val));
                    }
                }
                else {
                    var filter_childs = [];
                    for (var i = 0; i < vals.length; i++) {
                        if (filter_childs.length <= 0) {
                            filter_childs.push(new Filter(null, elSelect.attr("name"), OperatorType.Contain, vals[i]));
                        } else {
                            filter_childs.push(new Filter(LogicType.Or, elSelect.attr("name"), OperatorType.Contain, vals[i]));
                        }
                    }

                    if (filters.length <= 0) {
                        filters.push(new Filter(null, null, operatorType, val, filter_childs));
                    } else {
                        filters.push(new Filter(LogicType.And, null, operatorType, val, filter_childs));
                    }
                }
            }
            else {
                if (filters.length <= 0) {
                    filters.push(new Filter(null, elSelect.attr("name"), operatorType, val));
                } else {
                    filters.push(new Filter(LogicType.And, elSelect.attr("name"), operatorType, val));
                }
            }
        }

    },
    GetFilterFromDateInput: function (elDate, filters, name) {
        if (elDate.val() != "") {
            var operatorType;
            var target = elDate.attr("data-field-compare");
            if (name.toLowerCase() == "startdate") {
                operatorType = OperatorType.GreaterThanEqual;
            }
            else if (name.toLowerCase() == "enddate") {
                operatorType = OperatorType.LowerThanEqual;
            } else {
                operatorType = OperatorType.Equal;
            }
            if (filters.length <= 0) {
                filters.push(new Filter(null, target, operatorType, elDate.val()));
            } else {
                filters.push(new Filter(LogicType.And, target, operatorType, elDate.val()));
            }
        }

    },
    // Use for popup form
    GetSerialize: function (form) {
        //remove disable to get data
        var disabled = form.find(':input:disabled').removeAttr('disabled');
        let data = form.serializeArray();
        disabled.attr('disabled', 'disabled'); //add disabled input

        let rs = {};
        for (let i in data) {
            if (!rs.hasOwnProperty(data[i].name))
                rs[data[i].name] = [];
            rs[data[i].name].push(data[i].value.trim());// Trim D
        }
        for (let i in rs) {
            if (rs[i].length === 1) {
                rs[i] = rs[i].join(",");
            }
            else {
                rs[i] = JSON.stringify(rs[i]);
            }
        }

        return rs;
    },
    // Use for quickSerch form
    GetSerialize2: function (form) {
        var keys = {};
        var multipleSelect = [];
        form.find("input, select, textarea, button").each(function () {
            var el = jQuery(this);
            var name = el.prop("name");
            if (el.attr('multiple')) {
                multipleSelect.push(name);
            }
            if (!CommonJs.IsEmpty(name)) {
                var tagName = el.prop("tagName").toLowerCase();
                if (tagName == "input") {
                    var type = el.prop("type").toLowerCase();
                    if (type == "text" || type == "password" || type == "hidden" || type == "number" || type == "search") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (!CommonJs.IsEmpty(el.val()))
                            el.val(el.val().trim());
                        keys[name].push(el.val());
                    } else if (type == "checkbox") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (el.prop("checked")) {
                            keys[name].push(el.val() == 'true' ? true : el.val());
                        }
                        else {
                            keys[name].push(el.val() == 'true' ? false : 0);
                        }
                        //if (!checkboxs.hasOwnProperty(name)) {
                        //    checkboxs[name] = 0;
                        //}
                        //checkboxs[name]++;
                    } else if (type == "radio") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (el.prop("checked")) {
                            keys[name].push(el.val());
                        }
                    } else {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (!CommonJs.IsEmpty(el.val()))
                            el.val(el.val().trim());
                        keys[name].push(el.val());
                    }
                } else if (tagName != "button") {
                    if (tagName == 'select') {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (Array.isArray(el.val())) {
                            keys[name] = el.val();
                        } else {
                            keys[name].push(el.val());
                        }

                    } else {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        keys[name].push(el.val());
                    }
                }
            }
        });
        for (var k in keys) {
            if (multipleSelect.indexOf(k) >= 0) {
                keys[k] = JSON.stringify(keys[k]);
                continue;
            }
            var vals = keys[k];
            if (vals.length == 1) { //|| !checkboxs.hasOwnProperty(k)
                keys[k] = vals.join(",");
                if (keys[k] == 'true' || keys[k] == 'false') {
                    keys[k] = keys[k] == 'true';
                }
            } else {
                keys[k] = JSON.stringify(vals);
            }
        }
        return keys;
    },
    // Use for quickFilter form
    GetSerialize3: function (form, btn) {
        var keys = {};
        var filters = [];
        form.find("input, select, textarea, button").each(function () {
            var el = jQuery(this);
            var name = el.prop("name");
            if (!CommonJs.IsEmpty(name)) {
                var tagName = el.prop("tagName").toLowerCase();
                if (tagName == "input") {
                    var type = el.prop("type").toLowerCase();
                    if (type == "text" ||
                        type == "password" ||
                        type == "hidden" ||
                        type == "number" ||
                        type == "search" ||
                        type == "month" ||
                        type == "date") {
                        if (filters.filter(x => x.field).length <= 0 && name != '__RequestVerificationToken') {
                            if (!CommonJs.IsEmpty(el.val()))
                                el.val(el.val().trim());

                            if (el.val() !== '') {
                                if (name.toLowerCase() == "startdate" ||
                                    name.toLowerCase() === "enddate" ||
                                    name.toLowerCase() === "equaldate") {
                                    //filter with dateTimepicker
                                    CommonJs.GetFilterFromDateInput(el, filters, name);
                                } else {
                                    //filters.push(new Filter(null, 'Name', OperatorType.Contain, el.val()));
                                    CommonJs.GetFilterFromTextBox(el, filters);
                                }
                            }
                        } else if (filters.filter(x => x.field).length > 0 && name != '__RequestVerificationToken') {
                            if (!CommonJs.IsEmpty(el.val()))
                                el.val(el.val().trim());

                            if (el.val() !== '') {
                                if (name.toLowerCase() == "startdate" ||
                                    name.toLowerCase() === "enddate" ||
                                    name.toLowerCase() === "equaldate") {
                                    //filter with dateTimepicker
                                    CommonJs.GetFilterFromDateInput(el, filters, name);
                                } else {
                                    //filters.push(new Filter(null, 'Name', OperatorType.Contain, el.val()));
                                    CommonJs.GetFilterFromTextBox(el, filters);
                                }
                            }
                        }
                    } else if (type == "checkbox") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (el.prop("checked")) {
                            keys[name].push(el.val());
                        } else {
                            keys[name].push(0);
                        }
                    } else if (type == "radio") {
                        if (!keys.hasOwnProperty(name)) {
                            keys[name] = [];
                        }
                        if (el.prop("checked")) {
                            keys[name].push(el.val());
                        }
                    }

                } else if (tagName == "select") {
                    CommonJs.GetFilterFromSelect(el, filters);
                }

                else if (tagName != "button") {
                    if (!keys.hasOwnProperty(name)) {
                        keys[name] = [];
                    }
                    keys[name].push(el.val());
                }
            }
        });
        for (var k in keys) {
            var vals = keys[k];
            if (vals.length == 1) { //|| !checkboxs.hasOwnProperty(k)
                keys[k] = vals.join(",");
            } else {
                keys[k] = JSON.stringify(vals);
            }
        }

        if (btn != undefined && btn.attr("data-page") != undefined) {
            let pageInfo = new PageInfo(btn.attr("data-page"), btn.attr("data-page-size"));
            keys = new PagingRequest(pageInfo, null, filters);
        }
        else if (btn != undefined && btn.val() != undefined) {
            if (btn.attr("data-page-size") != undefined) {
                let pageInfo = new PageInfo(btn.val(), btn.attr("data-page-size"));
                keys = new PagingRequest(pageInfo, null, filters);
            } else {
                let pageInfo = new PageInfo(1, btn.val());
                keys = new PagingRequest(pageInfo, null, filters);
            }

        }
        else {
            let pageInfo = new PageInfo(1, 10);
            keys = new PagingRequest(pageInfo, null, filters);
        }

        return keys;
    },
    ConfigDataTable: function () {
        if ($('.table-rps') != undefined && $('.table-rps').length > 0) {
            $('.table-rps').DataTable({
                "retrieve": true,
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": false,
                "info": false,
                "autoWidth": false,
                "responsive": true,
            });
        }

        if ($('.table-scroll') != undefined && $('.table-scroll').length > 0) {
            $('.table-scroll').DataTable({
                "retrieve": true,
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": false,
                "info": false,
                "autoWidth": false,
                //"scrollY": '60vh',
                //"scrollCollapse": true,
                "responsive": true,
            });
        }
    },

    ActiveMagnificPopup: function () {
        if ($('.image-popup') != undefined && $('.image-popup').length > 0) {
            $('.image-popup').magnificPopup({
                type: 'image',
                mainClass: 'mfp-with-zoom', // this class is for CSS animation below
                zoom: {
                    enabled: true, // By default it's false, so don't forget to enable it

                    duration: 300, // duration of the effect, in milliseconds
                    easing: 'ease-in-out', // CSS transition easing function

                    // The "opener" function should return the element from which popup will be zoomed in
                    // and to which popup will be scaled down
                    // By defailt it looks for an image tag:
                    opener: function (openerElement) {
                        // openerElement is the element on which popup was initialized, in this case its <a> tag
                        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    }
                },
                gallery: {
                    enabled: true
                },

            });
        }

        if ($('.zoom-img') != undefined && $('.zoom-img').length > 0) {
            $('.zoom-img').ezPlus({
                scrollZoom: true
            });

        }

    },

    Select2Init: function (container) {
        try {
            if (container == undefined)
                container = jQuery(document);

            function formatResult(node) {
                if (typeof (node.element) == undefined) {
                    return node.text;
                }
                var level = 0;
                if (node.element !== undefined) {
                    if (!node.element.hasAttribute("level")) return node.text;
                    var levelvalue = (node.element.getAttribute("level"));
                    if (levelvalue == null) level = 0;
                    else level = levelvalue;
                }
                var $result = $('<span style="padding-left:' + (20 * level) + 'px;">' + node.text + '</span>');
                if (level == 0) $result = $('<span style="font-weight: bold;">' + node.text + '</span>');
                return $result;
            };
            container.find('select.select2').each(function () {
                let el = $(this);
                let isTags = el.hasClass('tags')
                if (el.hasClass('nonSearch')) {
                    el.select2({
                        placeholder: function () {
                            $(this).data('placeholder');
                        },
                        width: function () {
                            $(this).data('width');
                        },
                        language: "vi",
                        minimumResultsForSearch: Infinity,
                        tags: isTags,
                        createTag: function (params) {
                            // Don't offset to create a tag if there is no @ symbol
                            //if (params.term.indexOf('@') === -1) {
                            //    // Return null to disable tag creation
                            //    return null;
                            //}

                            return {
                                id: 0,
                                text: params.term
                            }
                        }
                    });
                } else {
                    el.select2({
                        placeholder: function () {
                            $(this).data('placeholder');
                        },
                        width: function () {
                            $(this).data('width');
                        },
                        language: "vi",
                        tags: isTags,
                        createTag: function (params) {
                            // Don't offset to create a tag if there is no @ symbol
                            //if (params.term.indexOf('@') === -1) {
                            //    // Return null to disable tag creation
                            //    return null;
                            //}

                            return {
                                id: 0,
                                text: params.term
                            }
                        }
                    });
                }

            });
            $('body').on('shown.bs.modal', '.modal', function () {
                $(this).find('.modal-body .select2').each(function () {
                    var dropdownParent = $(document.body);
                    var modalShown = $(this).parents('.modal.show:first');
                    if (modalShown.length !== 0) {
                        dropdownParent = modalShown;
                    }
                    $(this).select2({
                        dropdownParent: dropdownParent,
                        language: "vi",
                        templateResult: formatResult,
                    });
                });

            });
            //$('#drdPageSize').select2({
            //    width: 70,
            //    minimumResultsForSearch: Infinity,
            //    dropdownParent: $('#drdPageSize').parent(),
            //    language: "vi"
            //});
        } catch (e) {
            console.log(e);
        }
    },
    UpdateSelect2: function (container) {
        if (container != undefined && container.hasClass("select2")) {
            container.select2({
                placeholder: function () {
                    $(this).data('placeholder');
                },
                width: function () {
                    $(this).data('width');
                },
                language: "vi"
            });
        }
        else {
            if (container == undefined)
                container = jQuery(document);

            container.find('.select2').each(function () {
                let el = $(this);
                let isTags = el.hasClass('tags')
                if (el.hasClass('nonSearch')) {
                    el.select2({
                        placeholder: function () {
                            $(this).data('placeholder');
                        },
                        width: function () {
                            $(this).data('width');
                        },
                        language: "vi",
                        minimumResultsForSearch: Infinity,
                        tags: isTags
                    });
                } else {
                    el.select2({
                        placeholder: function () {
                            $(this).data('placeholder');
                        },
                        width: function () {
                            $(this).data('width');
                        },
                        language: "vi",
                        tags: isTags
                    });
                }

            });
        }

    },
    IsInteger: function (val) {
        return !isNaN(val) && !CommonJs.IsEmpty(val);
    },
    IsEmpty: function (val) {
        if (val === null)
            return true;
        if (typeof val == "object")
            return false;
        if (typeof val == "function")
            return false;

        return val === undefined || jQuery.trim(val).length === 0;
    },
    SetMessage: function (res, onlyFieldError, isNoReload) {
        //if (res.success != undefined)
        //    res.type = res.type.toLowerCase();
        if (res.success) {
            if (res.message != null && (res.data === null || res.data < 0 || res.data === false)) {
                CommonJs.ShowErrMsg(res.message);
            } else {

                CommonJs.ShowNotifyMsg(res);
            }

            if (!isNoReload)
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
        }
        else if (!res.success) {
            if (onlyFieldError) {
                if (res.data != undefined && res.data.length > 0) {
                    //Show error by line
                    for (var i = 0; i < res.data.length; i++) {
                        jQuery(".field-validation-valid[data-valmsg-for='" + res.data[i].field + "']").html(res.data[i].mss);
                    }
                    //Set focus to first element
                    if (document.getElementById(res.data[0].field) !== null) {
                        document.getElementById(res.data[0].field).focus();
                    }
                } else {
                    CommonJs.ShowNotifyMsg(res);
                }
            } else {
                CommonJs.ShowNotifyMsg(res);
            }
        }
        //else if (res.type === "warning")
        //    CommonJs.ShowNotifyMsg(res.type, res.message);
    },
    SetMessageNotRefresh: function (res, onlyFieldError) {
        //if (res.type != undefined)
        //    res.type = res.type.toLowerCase();
        if (res.success) {
            CommonJs.ShowNotifyMsg(res);
        }
        else if (!res.success) {
            if (onlyFieldError) {
                if (res.data != undefined && res.data.length > 0) {
                    //Show error by line
                    for (var i = 0; i < res.data.length; i++) {
                        jQuery(".field-validation-valid[data-valmsg-for='" + res.data[i].field + "']").html(res.data[i].mss);
                    }
                } else {
                    CommonJs.ShowNotifyMsg(res);
                }
            } else {
                CommonJs.ShowNotifyMsg(res);
            }
        }
        //else if (res.type === "warning")
        //    CommonJs.ShowNotifyMsg(res.type, res.message);
    },
    QuickActions: function () {
        jQuery(document).on("submit",
            ".quickSearch:not(.quickSearchDoc)",
            function () {
                let form = $(this);
                let url = form.attr("action");
                let method = form.attr("method");
                let target = form.attr("data-target");
                let data = CommonJs.GetSerialize2(form);

                jQuery.ajax({
                    type: method,
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        $(target).html('');
                        CommonJs.LazyLoadAjax();
                    },
                    success: function (rs) {
                        try {
                            if (form.attr("data-state") != "0") {
                                window.history.pushState(null, "", CommonJs.FormBuilderQString(form));
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        CommonJs.ToggleMultiTicks(jQuery(target));
                        $(target).html(rs);
                        CommonJs.Select2Init();
                        CommonJs.UpdateTreeGrid();
                    }
                });
                return false;
            });

        jQuery(document).on("submit",
            ".quickFilter",
            function () {
                let form = $(this);
                let url = form.attr("action");
                let method = form.attr("method");
                let target = form.attr("data-target");
                let data = CommonJs.GetSerialize3(form);
                let patternDate = /(\d{2})\/(\d{2})\/(\d{4})/;
                var startDate = $('input[name="StartDate"]').val();
                var endDate = $('input[name="EndDate"]').val();
                if (startDate != '' && endDate != '' && startDate != undefined && endDate != undefined && (new Date(startDate.replace(patternDate, '$3-$2-$1'))) > (new Date(endDate.replace(patternDate, '$3-$2-$1')))) {
                    var res = [];
                    res["success"] = false;
                    res["message"] = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
                    CommonJs.SetMessage(res);
                    return false;
                }
                jQuery.ajax({
                    type: method,
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        $(target).html('<div class="spinner-border text-primary" role="status"></div ><b> Loading...</b > ');
                        CommonJs.LazyLoadAjax();
                    },
                    success: function (rs) {

                        if (rs.success != undefined) {
                            CommonJs.ShowErrMsg(rs.message);
                        }
                        try {
                            if (form.attr("data-state") != "0") {
                                //window.history.pushState(null, "", CommonJs.FormBuilderQString(form));
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        CommonJs.ToggleMultiTicks(jQuery(target));
                        $(target).html(rs);
                        CommonJs.Select2Init();
                        CommonJs.UpdateTreeGrid();
                        CommonJs.ConfigDataTable();
                    }
                });
                return false;
            });


        jQuery(document).on("submit",
            ".quickSearchDoc",
            function () {
                event.preventDefault();
                //return false;
                // event.preventDefault();
                let form = $(this);
                let url = form.attr("action");
                let method = form.attr("method");
                let target = form.attr("data-target");
                let data = CommonJs.GetSerialize2(form);
                var lstcolumn = [];
                $.each($("input[name='column']:checked"),
                    function () {
                        lstcolumn.push($(this).attr('id'));
                    });
                let obj = {
                    condition: data,
                    LstComlumns: lstcolumn
                }
                jQuery.ajax({
                    type: method,
                    async: true,
                    url: url,
                    data: obj,
                    beforeSend: function () {
                        $(target).html('');
                        CommonJs.LazyLoadAjax();
                    },
                    success: function (rs) {
                        try {
                            if (form.attr("data-state") != "0") {
                                window.history.pushState(null, "", CommonJs.FormBuilderQString(form));
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        CommonJs.ToggleMultiTicks(jQuery(target));
                        $(target).html(rs);
                        CommonJs.Select2Init();
                        CommonJs.UpdateTreeGrid();
                    }
                });
                return false;
            });

        jQuery(document).on("click", "#Apply", function (event) {
            event.preventDefault();
            //return false;
            // event.preventDefault();
            $('#Modal').modal('hide');
            //  $('#displayfield ').attr('hidden', '');
            let form = $("#frmCollectionManagement");
            let url = form.attr("action");
            let method = form.attr("method");
            let target = form.attr("data-target");
            let data = CommonJs.GetSerialize2(form);
            var lstcolumn = [];
            $.each($("input[name='column']:checked"), function () {
                stt = $(this).closest('tr').find('input[col="no"]').val();
                let item = {
                    field: $(this).attr('id'),
                    stt: stt
                }
                console.log(item)
                lstcolumn.push($(this).attr('id'));
            });
            let obj = {
                condition: data,
                LstComlumns: lstcolumn
            }
            jQuery.ajax({
                type: method,
                async: true,
                url: "/Storage/SearchByConditionbyColumn",
                data: obj,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    //try {
                    //    if (form.attr("data-state") != "0") {
                    //        window.history.pushState(null, "", CommonJs.FormBuilderQString(form));
                    //    }
                    //} catch (e) {
                    //    console.log(e);
                    //}
                    CommonJs.ToggleMultiTicks(jQuery(target));
                    $(target).html(rs);
                    CommonJs.Select2Init();
                    CommonJs.UpdateTreeGrid();
                }
            });
            return false;
        });



        jQuery(document).on("click", ".quickUpdate", function () {
            let btn = $(this);
            let url = btn.attr("data-href");
            if (CommonJs.IsEmpty(url))
                url = btn.attr("href");
            let target = btn.attr("data-target");;
            var data = btn.getDataUppername();
            var method = btn.attr("data-method") || "GET";
            if (btn.attr("data-has-checkboxes") == "true") {
                let ids = [];
                let table = $("#dataTables_wrapper").find("table");
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var id = jQuery(this).attr("data-id");
                        if (CommonJs.IsInteger(id)) {
                            ids.push(id);
                        }
                    }
                });
                if (ids.length > 0)
                    data.ids = ids;
            }

            jQuery.ajax({
                type: method,
                async: true,
                url: url,
                data: data,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    if (rs.type != undefined || (rs.success != undefined && !rs.success)) {
                        CommonJs.SetMessage(rs);
                        return false;
                    };

                    $(target).html(rs);

                    CommonJs.UpdateFormState($(target));
                    CommonJs.UpdateInputMoney($(target));
                    CommonJs.UpdateIsNumber($(target));
                    CommonJs.DateTimeFormat('right');
                    CommonJs.Select2Init(jQuery(target));
                    //Tìm modal đang hiện
                    CommonJs.OpenModal(jQuery(target));



                }
            });
            return false;
        });
        jQuery(document).on("click", ".quickPopup", function () {
            let btn = $(this);
            let url = btn.attr("data-href");
            if (CommonJs.IsEmpty(url))
                url = btn.attr("href");
            let target = btn.attr("data-target");;
            var data = btn.getDataUppername();
            var method = btn.attr("data-method") || "GET";
            if (btn.attr("data-has-checkboxes") == "true") {
                let ids = [];
                let table = $("#dataTables_wrapper").find("table");
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var id = jQuery(this).attr("data-id");
                        if (CommonJs.IsInteger(id)) {
                            ids.push(id);
                        }
                    }
                });
                if (ids.length > 0)
                    data.ids = ids;
            }

            jQuery.ajax({
                type: method,
                async: true,
                url: url,
                data: data,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    if (rs.type != undefined || (rs.success != undefined && !rs.success)) {
                        CommonJs.SetMessage(rs);
                        return false;
                    };

                    $(target).html(rs);

                    CommonJs.UpdateFormState($(target));
                    CommonJs.UpdateInputMoney($(target));
                    CommonJs.UpdateIsNumber($(target));
                    CommonJs.DateTimeFormat('right');

                    //Tìm modal đang hiện
                    CommonJs.OpenModal(jQuery(target));
                    setTimeout(function () { CommonJs.Select2Init(jQuery(target)); }, 500);



                }
            });
            return false;
        });
        jQuery(document).on("click", ".addBookmark", function () {
            let target = $(this);
            let id = $(this).attr("data-idModule");
            let url = '';
            if ($(this).hasClass('far')) {
                url = '/Home/AddBookMark';
            } else {
                url = '/Home/RemoveBookMark';
            }
            jQuery.ajax({
                type: 'POST',
                async: true,
                url: url,
                data: { id: id },
                success: function (rs) {
                    CommonJs.ShowNotifyMsg(rs);
                    if (rs.data == 0) {
                        target.removeClass();
                        target.addClass('far fa-star btn-bookmark text-secondary addBookmark');
                        target.attr('data-original-title', 'Thêm lối tắt trang chủ');
                        target.attr('title', 'Thêm lối tắt trang chủ');
                    } else {
                        target.removeClass();
                        target.addClass('fas fa-star btn-bookmark text-yellow addBookmark');
                        target.attr('data-original-title', 'Bỏ lối tắt trang chủ');
                        target.attr('title', 'Bỏ lối tắt trang chủ');
                    }

                    return false;
                }
            });
            return false;
        });

        jQuery(document).on("click", ".quickDelete", function () {
            let id = $(this).attr("data-id");
            let name = $(this).attr("data-name");
            let url = $(this).attr("href");

            let confirmStr = jQuery(this).attr("data-comfirm-message") || 'Bạn có muốn xóa: ' + (name || 'bản ghi');
            let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
            confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
            if (confirmHeader === '') {
                confirmHeader = confirmMessage;
                confirmMessage = '';
            }
            CommonJs.ShowConfirmMsg(
                confirmHeader,
                confirmMessage,
                //'Bạn không thể phục hồi dữ liệu đã xóa',
                'Xóa',
                'Hủy',
                function () {
                    let someData = { id: id };
                    let method = "POST";
                    let ssCallBack = function (res) {
                        CommonJs.SetMessage(res);
                    };
                    CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                });
            $(".modal-draggable").draggable({ handle: '.modal-header' });
            return false;
        });

        jQuery(document).on("click", ".quickDeletes", function () {
            let table = $("#dataTables_wrapper").find("table");
            let ids = [];
            let names = '';
            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    var name = jQuery(this).data("item-name");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                        names += name + ', '
                    }
                }
            });
            let url = jQuery(this).data("url");
            let name = $(this).data("name");
            if (names.indexOf(',') > -1) {
                names = names.substr(0, names.length - 2);
            }
            let confirmStr = jQuery(this).data("comfirm-message") || 'Bạn có muốn xóa ' + (name || 'bản ghi') + ': ' + names;
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }
            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                CommonJs.ShowConfirmMsg(
                    confirmHeader,
                    confirmMessage,
                    'Xóa',
                    'Hủy',
                    function () {
                        let someData = { ids: ids };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
            }
            return false;
        });

        jQuery(document).on("click", ".quickApprove", function () {
            let table = $("#dataTables_wrapper").find("table");
            let ids = [];
            let names = '';
            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    var name = jQuery(this).data("item-name");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                        names += name + ', '
                    }
                }
            });
            let url = jQuery(this).data("url");
            let name = $(this).data("name");
            if (names.indexOf(',') > -1) {
                names = names.substr(0, names.length - 2);
            }
            let confirmStr = jQuery(this).data("comfirm-message") || 'Bạn có muốn duyệt lưu kho ' + (name || 'hồ sơ') + ': ' + names;
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }

            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    'Phê duyệt',
                    'Hủy',
                    function () {
                        let someData = { ids: ids };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
            }
            return false;
        });

        jQuery(document).on("click", ".quickRestoreDB", function () {
            let table = $("#dataTables_wrapper").find("table");
            let ids = [];
            let names = '';
            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    var name = jQuery(this).data("item-name");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                        names += name + ', '
                    }
                }
            });
            let url = jQuery(this).data("url");
            let name = $(this).data("name");
            if (names.indexOf(',') > -1) {
                names = names.substr(0, names.length - 2);
            }
            let confirmStr = jQuery(this).data("comfirm-message") || 'Bạn có muốn khôi phục dữ liệu ';
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }

            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    'Đống ý',
                    'Hủy',
                    function () {
                        let someData = { ids: ids };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
            }
            return false;
        });

        jQuery(document).on("click", ".quickSendDelivery", function () {
            let id = $(this).attr("data-id");
            let name = $(this).attr("data-name");
            let url = $(this).attr("href");

            let confirmStr = jQuery(this).attr("data-comfirm-message") || 'Bạn có muốn gửi bàn giao: ' + (name || 'biên bản');
            let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
            confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
            if (confirmHeader === '') {
                confirmHeader = confirmMessage;
                confirmMessage = '';
            }
            CommonJs.ShowConfirmMsg2(
                confirmHeader,
                confirmMessage,
                //'Bạn không thể phục hồi dữ liệu đã xóa',
                'Bàn giao',
                'Hủy',
                function () {
                    let someData = {};
                    let method = "POST";
                    let ssCallBack = function (res) {
                        CommonJs.SetMessage(res);
                    };
                    CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                });
            $(".modal-draggable").draggable({ handle: '.modal-header' });
            return false;
        });

        jQuery(document).on("click", ".quickSendListDelivery", function () {
            let table = $("#dataTables_wrapper").find("table");
            let ids = [];
            let names = '';
            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    var name = jQuery(this).data("item-name");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                        names += name + ', '
                    }
                }
            });
            let url = jQuery(this).data("url");
            let name = $(this).data("name");
            if (names.indexOf(',') > -1) {
                names = names.substr(0, names.length - 2);
            }
            let confirmStr = jQuery(this).data("comfirm-message") || 'Bạn có muốn gửi bàn giao biên bản' + (name || 'hồ sơ') + ': ' + names;
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }

            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    'Bàn giao',
                    'Hủy',
                    function () {
                        let someData = { ids: ids };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
            }
            return false;
        });

        jQuery(document).on("submit", ".onUpdateInputState", function (e) {
            e.preventDefault()
            return false;
        });

        jQuery(document).on("hidden.bs.modal", ".modal.reload", function (e) {
            var self = $(this);
            self.removeClass("reload");
            window.setTimeout(function () { location.reload() }, 1000)
        });

        jQuery(document).on("click", ".quickSubmit", function () {
            //Get Editer content
            var editer = document.getElementById("editor");
            if (editer != null) {
                var note = editer.innerHTML;
                document.getElementById("Description").value = note;
            }

            var self = $(this);
            var form = self.closest("form");

            $(".quickSubmit").prop({ disabled: true });
            if (form.hasClass("validateForm")) {
                var bootstrapValidator = form.data('bootstrapValidator');
                if (bootstrapValidator == undefined) {
                    CommonJs.ValidateForm(form);
                }
                bootstrapValidator = form.data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid(true)) {
                    $(".quickSubmit").prop({ disabled: false });
                    if (bootstrapValidator.$invalidFields.length > 0) {
                        $(bootstrapValidator.$invalidFields[0]).focus();
                    }
                    return false;
                }
            }

            //Clear old message
            jQuery(".field-validation-valid").html("");

            let data = CommonJs.GetSerialize2(form); //trimspace
            let url = self.attr("data-url");
            let resUrl = self.attr("data-resurl");
            let resetFields = self.attr("data-reset");
            let increField = self.attr("data-increment");
            let notReload = self.attr("data-notReload");

            let dataType = "json"
            let ssCallBack = function (res) {
                if (res.success) {
                    if (form.attr("data-is-append-select") == "true") {
                        form.closest('.modal').modal('toggle');//Close model when success
                        var slTarget = jQuery(form.attr("data-select-target"));
                        slTarget.append('<option value="' + res.data.id + '" >' + res.data.name + '</option>');
                        slTarget.val(res.data.id);
                        CommonJs.UpdateSelect2(slTarget);
                        CommonJs.SetMessage(res, true, true);
                        return false;
                    }


                    if (res.data && res.data.url) {
                        window.open(res.data.url);//Close model when success
                    }
                    else {
                        form.closest('.modal').modal('toggle');//Close model when success
                        if (resUrl != '' && resUrl != undefined) {
                            resUrl = resUrl.replaceAll("{n}", res.data);

                            if (notReload == undefined || notReload == '') {
                                setTimeout(function () {
                                    window.location = resUrl;
                                }, 1000);
                            }

                        }



                        CommonJs.SetMessage(res, true, resUrl);
                    }

                } else if (res.type === "Redirect") { //type là redirect
                    window.location.href = res.message;
                } else { // thất bại
                    $(".quickSubmit").prop({ disabled: false });
                    CommonJs.SetMessage(res, true, resUrl);
                }
            }
            //todo : handle with errCallback
            let errCallback = function () {
                $(".quickSubmit").prop({ disabled: false });
                return false;
            }

            CommonJs.CustAjaxCall(data, "POST", url, dataType, ssCallBack, errCallback);
            return false;
        });

        jQuery(document).on("click", ".sendJobResult", function () {
            var self = $(this);
            var form = self.closest("form");

            $(".sendJobResult").prop({ disabled: true });
            if (form.hasClass("validateForm")) {
                var bootstrapValidator = form.data('bootstrapValidator');
                if (bootstrapValidator == undefined) {
                    CommonJs.ValidateForm(form);
                }
                bootstrapValidator = form.data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid(true)) {
                    $(".sendJobResult").prop({ disabled: false });
                    if (bootstrapValidator.$invalidFields.length > 0) {
                        $(bootstrapValidator.$invalidFields[0]).focus();
                    }
                    return false;
                }
            }

            //Clear old message
            jQuery(".field-validation-valid").html("");

            let formData = CommonJs.GetSerialize(form); //trimspace
            let arrObject = [];
            for (var jobId in formData) {
                // propertyName is what you want
                // you can get the value like this: myObject[propertyName]
                if (jobId != '__RequestVerificationToken' && jobId.indexOf("view_") == -1) {
                    arrObject.push({ JobId: jobId, Value: formData[jobId] });
                }

            }
            let data = { lstJob: arrObject };

            let url = self.attr("data-url");
            let resUrl = self.attr("data-resurl");
            let resetFields = self.attr("data-reset");
            let increField = self.attr("data-increment");
            let code = form.attr("data-code");
            if (code != undefined && code != '') {
                JobConfig.RemoveKey(code);
            }
            let autoReceive = localStorage.getItem('AutoReceiveJob') || 'false';
            //todo : handle with errCallback
            let errCallback = function () {
                $(".sendJobResult").prop({ disabled: false });
                return false;
            }


            //swal fire
            let comfimTitle = self.attr("data-comfim-lable");
            let closeTitle = self.attr("data-close-lable");
            let textboxTitle = self.attr("data-config-message") || 'Tiếp tục nhận công việc';
            let comfirmMessage = self.attr("data-comfirm-message") || 'Xác nhận hoàn tất!:Bạn có chắc chắn hoàn tất lượt công việc này không?';
            let confirmHeader = comfirmMessage.substring(0, comfirmMessage.indexOf(':') + 1).trim();
            confirmMessage = comfirmMessage.substring(comfirmMessage.indexOf(':') + 1).trim();
            if (autoReceive == 'true') {
                let someData = {
                    isChecked: 'true',
                    lstJob: arrObject
                };
                let method = "POST";
                let dataType = "json";
                let ssCallBack = function (res) {
                    if (res.success) {
                        if (res.data && res.data.url) {
                            window.open(res.data.url);//Close model when success
                        }
                        else {
                            form.closest('.modal').modal('toggle');//Close model when success
                            if (resUrl != '' && resUrl != undefined)
                                setTimeout(function () {
                                    window.location = resUrl;
                                }, 1000);


                            //Gửi message có reload hay không
                            if (resetFields != '' && resetFields != undefined) {
                                CommonJs.SetMessage(res, true, true);
                                setTimeout(function () {
                                    $(".sendJobResult").prop({ disabled: false });
                                }, 500); // đợi nửa giây để bật lại nút ấn

                            } else {
                                CommonJs.SetMessage(res, true, resUrl);
                            }
                        }

                    } else if (res.type === "Redirect") { //type là redirect
                        window.location.href = res.message;
                    } else { // thất bại
                        $(".sendJobResult").prop({ disabled: false });
                        CommonJs.SetMessage(res, true, resUrl);
                    }
                }
                CommonJs.CustAjaxCall(someData, method, url, dataType, ssCallBack, errCallback);
            } else {
                $(".sendJobResult").prop({ disabled: false });
                CommonJs.ShowConfirmCheckBox(
                    confirmHeader,
                    confirmMessage,
                    //'Bạn không thể phục hồi dữ liệu đã xóa',
                    comfimTitle || 'Đồng ý',
                    closeTitle || 'Bỏ qua',
                    textboxTitle,
                    autoReceive,
                    function (isChecked) {
                        let someData = {
                            isChecked: isChecked,
                            lstJob: arrObject
                        };
                        localStorage.setItem('AutoReceiveJob', isChecked);
                        let method = "POST";
                        let dataType = "json";
                        let ssCallBack = function (res) {
                            if (res.success) {
                                if (res.data && res.data.url) {
                                    window.open(res.data.url);//Close model when success
                                }
                                else {
                                    form.closest('.modal').modal('toggle');//Close model when success
                                    if (resUrl != '' && resUrl != undefined)
                                        setTimeout(function () {
                                            window.location = resUrl;
                                        }, 1000);


                                    //Gửi message có reload hay không
                                    if (resetFields != '' && resetFields != undefined) {
                                        CommonJs.SetMessage(res, true, true);
                                        setTimeout(function () {
                                            $(".sendJobResult").prop({ disabled: false });
                                        }, 500); // đợi nửa giây để bật lại nút ấn

                                    } else {
                                        CommonJs.SetMessage(res, true, resUrl);
                                    }
                                }

                            } else if (res.type === "Redirect") { //type là redirect
                                window.location.href = res.message;
                            } else { // thất bại
                                $(".sendJobResult").prop({ disabled: false });
                                CommonJs.SetMessage(res, true, resUrl);
                            }
                        }
                        CommonJs.CustAjaxCall(someData, method, url, dataType, ssCallBack, errCallback);
                    });
            }

            $(".modal-draggable").draggable({ handle: '.modal-header' });
            return false;
        });
        jQuery(document).on("click", ".quickSubmitAndContinue", function () {
            var self = $(this);
            var form = self.closest("form");
            form.closest('.modal').addClass("reload");
            $(".quickSubmit").prop({ disabled: true });
            $(".quickSubmitAndContinue").prop({ disabled: true });
            if (form.hasClass("validateForm")) {
                var bootstrapValidator = form.data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid(true)) {
                    $(".quickSubmit").prop({ disabled: false });
                    $(".quickSubmitAndContinue").prop({ disabled: false });
                    if (bootstrapValidator.$invalidFields.length > 0) {
                        $(bootstrapValidator.$invalidFields[0]).focus();
                    }
                    return false;
                }
            }

            ////validate special charater
            //var strInputs = form.find("input[type=text]:not(.hasSpecialChar,.datetimepicker-input)"); //Namnp: nếu input có class hasSpecialChar thì ko xét (Datepicker)
            //var strTextAreas = form.find("textarea");
            //var format = /[`!#$%^&*+\=\[\]{};':"\\|<>\/~]/;
            //var isValidateSuccess = true;
            //if (strInputs != null && strInputs != undefined && strInputs.length > 0) {
            //    for (var i = 0; i < strInputs.length; i++) {
            //        if (format.test(strInputs[i].value)) {
            //            var name = strInputs[i].getAttribute("name");
            //            jQuery(".field-validation-valid[data-valmsg-for='" + name + "']").html("Nội dung không được chứa ký tự đặc biệt");
            //            isValidateSuccess = false;
            //        }
            //    }
            //}
            //if (strTextAreas != null && strTextAreas != undefined && strTextAreas.length > 0) {
            //    for (var i = 0; i < strTextAreas.length; i++) {
            //        if (format.test(strTextAreas[i].value)) {
            //            var name = strTextAreas[i].getAttribute("name");
            //            jQuery(".field-validation-valid[data-valmsg-for='" + name + "']").html("Nội dung không được chứa ký tự đặc biệt");
            //            isValidateSuccess = false;
            //        }
            //    }
            //}
            //if (!isValidateSuccess)
            //    return false;

            //Clear old message
            jQuery(".field-validation-valid").html("");

            let data = CommonJs.GetSerialize(form); //trimspace
            let url = self.attr("data-url");
            let resUrl = self.attr("data-resurl");
            let dataType = "json"
            let ssCallBack = function (res) {
                if (res.type === "Success") {
                    if (form.attr("data-is-append-select") == "true") {
                        //form.closest('.modal').modal('toggle');//Close model when success
                        var slTarget = jQuery(form.attr("data-select-target"));
                        slTarget.append('<option value="' + res.data.id + '" >' + res.data.name + '</option>');
                        slTarget.val(res.data.id);
                        CommonJs.UpdateSelect2(slTarget);
                        CommonJs.SetMessage(res, true, true);
                        $(".quickSubmit").prop({ disabled: false });
                        $(".quickSubmitAndContinue").prop({ disabled: false });
                        return false;
                    }


                    if (res.data && res.data.url) {
                        window.open(res.data.url);//Close model when success
                    }
                    else {
                        //form.closest('.modal').modal('toggle');//Close model when success
                        if (resUrl != '' && resUrl != undefined)
                            setTimeout(function () {
                                window.location = resUrl;
                            }, 1000);
                        CommonJs.SetMessage(res, true, true);
                        $(".quickSubmit").prop({ disabled: false });
                        $(".quickSubmitAndContinue").prop({ disabled: false });
                    }

                } else if (res.type === "Redirect") {
                    window.location.href = res.message;
                } else {
                    $(".quickSubmit").prop({ disabled: false });
                    $(".quickSubmitAndContinue").prop({ disabled: false });
                    CommonJs.SetMessage(res, true, true);
                }
            }
            //todo : handle with errCallback
            let errCallback = function () {
                $(".quickSubmit").prop({ disabled: false });
                $(".quickSubmitAndContinue").prop({ disabled: false });
                return false;
            }

            CommonJs.CustAjaxCall(data, "POST", url, dataType, ssCallBack, errCallback);
            return false;
        });

        jQuery(document).on("change", ".checkboxes", function () {
            CommonJs.ToggleMultiTicks(jQuery(this).closest('table'));
        });

        jQuery(document).on("change", ".showDivByCheckBox", function () {
            let target = $(this).data("target");
            if ($(this).data('reverse')) {
                if ($(this).is(":checked")) {

                    $(target).hide(100);
                } else {
                    $(target).show(200);
                }
            } else {
                if ($(this).is(":checked")) {
                    $(target).show(200);
                } else {
                    $(target).hide(100);
                }
            }

        });

        jQuery(document).on('change', '.group-checkable', function () {
            var table = jQuery(this).closest("table");
            //console.log(jQuery(this).attr('data-isgroup'));
            if (jQuery(this).attr('data-group') != undefined) {
                var group = jQuery(this).attr('data-group');
                var set = table.find('.checkboxes[data-group="' + group + '"]');
                //var set = table.find('.checkboxes');
            } else {
                var set = table.find(".checkboxes, .sumChecked");
            }
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    if (!$(this).prop('disabled')) {
                        jQuery(this).prop("checked", true);
                        jQuery(this).closest('tr').addClass("active");
                    }
                } else {
                    jQuery(this).prop("checked", false);
                    jQuery(this).closest('tr').removeClass("active");
                }
            });
            CommonJs.ToggleMultiTicks(table);
        });

        jQuery(document).on("click", ".onSetPageIndex", function (e) {
            let btn = $(this);
            let form = jQuery(btn.attr("data-form"));
            // let data = CommonJs.GetSerialize2(form);
            let url = form.attr("action");
            let target = form.attr("data-target");
            //data.pageIndex = btn.attr("data-page");
            //data.pageSize = btn.attr("data-page-size");
            let data = CommonJs.GetSerialize3(form, btn);
            if (btn.parent().hasClass('active')) {
                btn.blur();
                return false;
            }
            jQuery.ajax({
                type: "POST",
                async: false,
                url: url,
                data: data,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    try {
                        if (form.attr("data-state") != "0") {
                            //window.history.pushState(null, rs.title, CommonJs.FormBuilderQString(form, data));
                            //jQuery(document).prop("title", rs.title);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    $(target).html(rs);
                    CommonJs.Select2Init();
                    CommonJs.ConfigDataTable();
                }
            });
            return false;
        });

        jQuery(document).on("change", ".onChangePageSize", function () {

            let select = $(this);
            let form = jQuery(select.attr("data-form"));
            // let data = CommonJs.GetSerialize2(form);
            let url = form.attr("action");
            let target = form.attr("data-target");
            let data = CommonJs.GetSerialize3(form, select);
            jQuery.ajax({
                type: "POST",
                async: false,
                url: url,
                data: data,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    try {
                        if (form.attr("data-state") != "0") {
                            //window.history.pushState(null, "", CommonJs.FormBuilderQString(form));
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    CommonJs.ToggleMultiTicks(jQuery(target));
                    $(target).html(rs);
                    CommonJs.Select2Init();
                    CommonJs.UpdateTreeGrid();
                    CommonJs.ConfigDataTable();
                }
            });
            return false;
        });

        jQuery(document).on("change", ".onChangePageIndex", function (e) {
            $(this).val($(this).val().replace(/[^0-9]/g, ""));
            if ($(this).val() == '') {
                $(this).val(1);
            }
            let val = $(this).val();
            let max = $(this).attr('max');
            if (Number(val) > Number(max)) {
                $(this).val(max);
            }
            if (val < 1) {
                $(this).val(1);
            }
            let btn = $(this);
            let form = jQuery(btn.attr("data-form"));
            let url = form.attr("action");
            let target = form.attr("data-target");
            let data = CommonJs.GetSerialize3(form, btn);
            if (btn.parent().hasClass('active')) {
                btn.blur();
                return false;
            }
            jQuery.ajax({
                type: "POST",
                async: false,
                url: url,
                data: data,
                beforeSend: function () {
                    $(target).html('');
                    CommonJs.LazyLoadAjax();
                },
                success: function (rs) {
                    try {
                        if (form.attr("data-state") != "0") {
                            //window.history.pushState(null, rs.title, CommonJs.FormBuilderQString(form, data));
                            //jQuery(document).prop("title", rs.title);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    $(target).html(rs);
                    CommonJs.Select2Init();
                    CommonJs.ConfigDataTable();
                }
            });
            return false;
        });

        jQuery(document).on("change", ".inputConfig", function (e) {
            $(this).val($(this).val().replace(/[^0-9]/g, ""));
            if ($(this).val() == '') {
                $(this).val(1);
            }
            let val = $(this).val();
            let max = $(this).attr('max');
            if (max != undefined && Number(val) > Number(max)) {
                $(this).val(max);
            }
            if (val < 1) {
                $(this).val(1);
            }

            let greater = $(this).attr('data-greater');
            if (greater != undefined && Number(val) < $(greater).val()) {
                $(greater).val(val);
            }

            let less = $(this).attr('data-less');

            if (less != undefined && Number(val) > $(less).val()) {
                $(less).val(val);
            }

            return false;
        });

        $('.inputConfig').keypress(function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57))
                return false;
            return true;
        });

        $('.isPrice').keypress(function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (
                (charCode != 46 || $(this).val().indexOf('.') != -1) && // “.” CHECK DOT, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
                return false;
            if ($(this).val().indexOf('.') == 0) { //Remove 0 first
                $(this).val($(this).val().replace(".", ""));
            }
            return true;
        });

        jQuery.fn.ForceNumericOnly = function () {
            return this.each(function () {
                $(this).keydown(function (e) {
                    var key = e.charCode || e.keyCode || 0;
                    // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
                    // home, end, period, and numpad decimal
                    return (
                        key == 8 ||
                        key == 9 ||
                        key == 13 ||
                        key == 46 ||
                        key == 110 ||
                        key == 190 ||
                        (key >= 35 && key <= 40) ||
                        (key >= 48 && key <= 57) ||
                        (key >= 96 && key <= 105));
                });
            });
        };

        jQuery(document).on("click", ".onAppendTemplate", function () {
            $(".dataTables_empty").closest('tr').remove();
            var obj = jQuery(this);
            var target = jQuery(obj.attr("data-target"));
            var temp = jQuery(obj.attr("data-template"));
            var cRowIndex = (target.find("tr").length);

            var maxWeight = 0;
            target.find("input[data-name='Priority']").each(function () {
                var cWeight = parseInt(jQuery(this).val());
                if (!isNaN(cWeight) && cWeight > maxWeight)
                    maxWeight = cWeight;
            });
            //Append and replace index
            CommonJs.Select2Init(cRow);
            target.append(temp.html().replaceAll("[n]", "[" + cRowIndex + "]"));
            var cRow = target.find("tr:nth(" + cRowIndex + ")");
            //Fix checkbox rename id 
            cRow.find(".custom-control.custom-checkbox").each(function () {
                let cb = jQuery(this).find(".checkboxes.custom-control-input");
                // let lb = jQuery(this).find(".custom-control-label");
                cb.attr("id", cb.attr("id") + cRowIndex);
                cb.next().attr("for", cb.attr("id"));
            });

            cRow.find("input[data-name='Priority']").val(maxWeight + 1);
            cRow.find("input[data-name='DigitizedTemplateId']").val($("#frmDigitalDigitizedTemplate").find('input[name="Id"]').val());
            cRow.find("input[data-name='DigitizedTemplateInstanceId']").val($("#frmDigitalDigitizedTemplate").find('input[name="InstanceId"]').val());
            CommonJs.Select2Init(cRow);
            CommonJs.UpdateIsNumber(cRow);
            CommonJs.DataTableSizing(cRow);
            return false;
        });

        jQuery(document).on("click", ".onDeleteItem", function () {
            var obj = jQuery(this);
            var isReindex = obj.attr("data-reindex") === "1";

            var tr = obj.closest(".item");
            var tbody = obj.closest("tbody");
            var cIndex = tr.index();

            var friends = tr.siblings("tr");
            if (tr.length > 0)
                tr.remove();

            if (isReindex && friends.length > 0) {
                //Đánh lại index
                const regex = /\[[0-9]+\]/gm;
                jQuery(tbody).find("select.select2-hidden-accessible").select2('destroy');
                friends.each(function (i, row) {
                    if (i >= cIndex) {
                        jQuery(row).find("input,select").each(function () {
                            var type = jQuery(this).attr("type");
                            var tagName = jQuery(this).prop("tagName").toLowerCase();
                            if (type == "checkbox" || type == "radio") {
                                jQuery(this).prop("checked", jQuery(this).prop("checked"));
                                jQuery(this).attr("checked", jQuery(this).prop("checked"))
                            }
                            else if (tagName == "select") {
                                jQuery(this).find("option[value='" + jQuery(this).val() + "']").attr("selected", "true");
                            }
                            else {
                                jQuery(this).attr("value", jQuery(this).val());
                            }
                        });

                        jQuery(row).html(jQuery(row).html().replace(regex, "[" + i + "]"));

                    }
                });
                CommonJs.UpdateSelect2(jQuery(tbody));
            }
            return false;
        });
        jQuery(document).on("click", ".getTemplate", function () {
            let url = $(this).attr("action");
            window.open(document.location.origin + url, '_blank');
            return false;
        });
        jQuery(document).on("click", ".exportByByte", function () {
            CommonJs.LazyLoadAjax();
            container = $('.content');
            var template = $('<div />', { id: 'loader-wrapper', class: 'lazyload-overlay preloader' }).append($('<div />', { id: 'loader' }));
            let btn = $(this);
            let form = jQuery(btn.attr("data-target"));
            let data = CommonJs.GetSerialize3(form);
            let url = $(this).attr("action");
          
            function Base64ToBytes(base64) {
                var s = window.atob(base64);
                var bytes = new Uint8Array(s.length);
                for (var i = 0; i < s.length; i++) {
                    bytes[i] = s.charCodeAt(i);
                }
                return bytes;
            };
            jQuery.ajax({
                type: "POST",
                async: true,
                url: url,
                data: data,
                beforeSend: function () {
                    container.append(template);
                    //show spinner icon in current button
                    $(btn).children('.spinner').show();
                },
                success: function (rs, status, xhr) {
                    try {
                        if (rs.success != undefined) {
                            CommonJs.SetMessage(rs);
                            return false;
                        };
                        var filename = rs.fileName;
                        var type = rs.mimeType;
                        var bytes = Base64ToBytes(rs.fileContents);
                        var blob = new Blob([bytes], { type: type });
                        var downloadUrl = URL.createObjectURL(blob);
                        //window.location = downloadUrl;
                        var a = document.createElement("a");
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);

                    } catch (e) {
                        console.log(e);
                    }
                },
                complete: function () {
                    template.remove();
                    $(btn).children('.spinner').hide();
                }
            });
            return false;
        });

        jQuery(document).on("click", ".exportFile", function () {

            let url = $(this).attr("action");
            function Base64ToBytes(base64) {
                var s = window.atob(base64);
                var bytes = new Uint8Array(s.length);
                for (var i = 0; i < s.length; i++) {
                    bytes[i] = s.charCodeAt(i);
                }
                return bytes;
            };
            jQuery.ajax({
                type: "POST",
                async: false,
                url: url,
                data: {},
                success: function (rs, status, xhr) {
                    try {
                        if (rs.type != undefined) {
                            CommonJs.SetMessage(rs);
                            return false;
                        };
                        var filename = rs.fileName;
                        var type = rs.mimeType;
                        var bytes = Base64ToBytes(rs.fileContents);
                        var blob = new Blob([bytes], { type: type });
                        var downloadUrl = URL.createObjectURL(blob);
                        //window.location = downloadUrl;
                        var a = document.createElement("a");
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);

                    } catch (e) {
                        console.log(e);
                    }
                }
            });
            return false;
        });
        jQuery(document).on("click", ".exportFiles", function () {
            function Base64ToBytes(base64) {
                var s = window.atob(base64);
                var bytes = new Uint8Array(s.length);
                for (var i = 0; i < s.length; i++) {
                    bytes[i] = s.charCodeAt(i);
                }
                return bytes;
            };
            let table = $("#dataTables_wrapper").find("table");
            let ids = [];
            let names = '';
            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    var name = jQuery(this).data("item-name");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                        names += name + ', '
                    }
                }
            });
            let url = jQuery(this).data("url");
            let name = $(this).data("name");
            if (names.indexOf(',') > -1) {
                names = names.substr(0, names.length - 2);
            }
            let confirmStr = jQuery(this).data("comfirm-message") || 'Bạn có muốn kết xuất ' + (name || 'bản ghi') + ': ' + names;
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }
            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    'Kết xuất',
                    'Hủy',
                    function () {
                        let someData = { ids: ids };
                        let method = "POST";
                        let ssCallBack = function (rs) {
                            try {
                                if (rs.type != undefined) {
                                    CommonJs.SetMessage(rs);
                                    return false;
                                };
                                var filename = rs.fileName;
                                var type = rs.mimeType;
                                var bytes = Base64ToBytes(rs.fileContents);
                                var blob = new Blob([bytes], { type: type });
                                var downloadUrl = URL.createObjectURL(blob);
                                //window.location = downloadUrl;
                                var a = document.createElement("a");
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);

                            } catch (e) {
                                console.log(e);
                            }
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
            }
            return false;
        });
        //Remove error when typing input in form
        jQuery(document).on("keyup, change", ".onUpdateInputState :input", function () {
            var obj = jQuery(this);
            obj.parent().find(".field-validation-valid").html("");
        });

        jQuery(document).on("click", ".quickComfirm", function () {
            let id = $(this).attr("data-id");
            let url = $(this).attr("data-url") || $(this).attr("href");
            let comfimTitle = $(this).attr("data-comfim-lable");
            let closeTitle = $(this).attr("data-close-lable");
            let resUrl = $(this).attr("data-resurl");
            let comfirmMessage = jQuery(this).attr("data-comfirm-message") || 'Xác nhận';
            let confirmHeader = comfirmMessage.substring(0, comfirmMessage.indexOf(':') + 1).trim();
            confirmMessage = comfirmMessage.substring(comfirmMessage.indexOf(':') + 1).trim();
            var hasReason = $(this).attr("data-has-reason") == "true";
            if (hasReason) {
                CommonJs.ShowConfirmMsgNote(
                    confirmHeader,
                    confirmMessage,
                    //'Bạn không thể phục hồi dữ liệu đã xóa',
                    comfimTitle || 'Đồng ý',
                    closeTitle || 'Hủy',
                    function (reason) {
                        let someData = {
                            note: reason
                        };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                            if (res.type === "success") {
                                if (resUrl != '' && resUrl != undefined)
                                    setTimeout(function () {
                                        window.location = resUrl;
                                    }, 1000);
                            }
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
                return false;
            } else {
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    //'Bạn không thể phục hồi dữ liệu đã xóa',
                    comfimTitle || 'Đồng ý',
                    closeTitle || 'Hủy',
                    function () {
                        let someData = {};
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessage(res);
                            if (res.type === "success") {
                                if (resUrl != '' && resUrl != undefined)
                                    setTimeout(function () {
                                        window.location = resUrl;
                                    }, 1000);
                            }
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    }, url);
                $(".modal-draggable").draggable({ handle: '.modal-header' });
                return false;
            }


        });

        jQuery(document).on("click", ".quickComfirms", function () {
            let table = $("#dataTables_wrapper").find("table");
            let redirectUrl = $(this).attr("redirect-url");
            let ids = [];
            let comfimTitle = $(this).attr("data-comfim-lable");
            let closeTitle = $(this).attr("data-close-lable");

            table.find(".checkboxes").each(function () {
                if (jQuery(this).prop("checked")) {
                    var id = jQuery(this).data("id");
                    if (CommonJs.IsInteger(id)) {
                        ids.push(id);
                    }
                }
            });
            let url = jQuery(this).data("url");

            let confirmStr = jQuery(this).attr("data-comfirm-message") || 'Xác nhận';
            if (confirmStr != undefined) {
                confirmStr = confirmStr.replaceAll("{n}", ids.length);
            }
            if (ids == undefined) {
                return false;
            } else {
                let confirmHeader = confirmStr.substring(0, confirmStr.indexOf(':') + 1).trim();
                confirmMessage = confirmStr.substring(confirmStr.indexOf(':') + 1).trim();
                if (confirmHeader === '') {
                    confirmHeader = confirmMessage;
                    confirmMessage = '';
                }
                var hasReason = $(this).attr("data-has-reason") == "true";
                if (hasReason) {
                    CommonJs.ShowConfirmMsgNote(
                        confirmHeader,
                        confirmMessage,
                        comfimTitle || 'Đồng ý',
                        closeTitle || 'Hủy',
                        function (reason) {
                            let someData = {
                                ids: ids,
                                note: reason
                            };
                            let method = "POST";
                            let ssCallBack = function (res) {
                                CommonJs.SetMessage(res);
                                if (redirectUrl != null && redirectUrl != undefined && redirectUrl != "") {
                                    if (res.type === "success") {
                                        setTimeout(function () {
                                            window.location.href = redirectUrl;
                                        }, 1000);
                                    }
                                }
                            };
                            CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                        });
                    $(".modal-draggable").draggable({ handle: '.modal-header' });
                    return false;
                } else {
                    CommonJs.ShowConfirmMsg2(
                        confirmHeader,
                        confirmMessage,
                        comfimTitle || 'Đồng ý',
                        closeTitle || 'Hủy',
                        function () {
                            let someData = {
                                ids: ids
                            };
                            let method = "POST";
                            let ssCallBack = function (res) {
                                CommonJs.SetMessage(res);
                                if (redirectUrl != null && redirectUrl != undefined && redirectUrl != "") {
                                    if (res.type === "success") {
                                        setTimeout(function () {
                                            window.location.href = redirectUrl;
                                        }, 1000);
                                    }
                                }
                            };
                            CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                        }, url);
                    $(".modal-draggable").draggable({ handle: '.modal-header' });
                    return false;
                }
            }
            return false;
        });

        jQuery(document).on("click", ".quickConfirmRestore", function () {
            let id = $("#ID").val();
            let url = $(this).attr("data-url") || $(this).attr("href");
            let comfimTitle = $(this).attr("data-comfim-lable");
            let closeTitle = $(this).attr("data-close-lable");

            let comfirmMessage = jQuery(this).attr("data-comfirm-message") || 'Xác nhận';
            let confirmHeader = comfirmMessage.substring(0, comfirmMessage.indexOf(':') + 1).trim();
            confirmMessage = comfirmMessage.substring(comfirmMessage.indexOf(':') + 1).trim();
            var hasReason = $(this).attr("data-has-reason") == "true";

            CommonJs.ShowConfirmMsg2(
                confirmHeader,
                confirmMessage,
                //'Bạn không thể phục hồi dữ liệu đã xóa',
                comfimTitle || 'Đồng ý',
                closeTitle || 'Hủy',
                function () {
                    let someData = { id: id };
                    let method = "POST";
                    let ssCallBack = function (res) {
                        CommonJs.SetMessage(res);
                    };
                    CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                }, url);
            $(".modal-draggable").draggable({ handle: '.modal-header' });
            return false;
        });

        jQuery(document).on("click", ".quickComfirmNoReload", function () {
            let url = $(this).attr("data-url") || $(this).attr("href");
            let redirectUrl = $(this).attr("redirect-url");
            let comfimTitle = $(this).attr("data-comfim-lable");
            let closeTitle = $(this).attr("data-close-lable");

            let comfirmMessage = jQuery(this).attr("data-comfirm-message") || 'Xác nhận';
            let confirmHeader = comfirmMessage.substring(0, comfirmMessage.indexOf(':') + 1).trim();
            confirmMessage = comfirmMessage.substring(comfirmMessage.indexOf(':') + 1).trim();
            var hasReason = $(this).attr("data-has-reason") == "true";
            if (hasReason) {
                CommonJs.ShowConfirmMsgNote(
                    confirmHeader,
                    confirmMessage,
                    //'Bạn không thể phục hồi dữ liệu đã xóa',
                    comfimTitle || 'Đồng ý',
                    closeTitle || 'Hủy',
                    function (reason) {
                        let someData = {
                            note: reason
                        };
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessageNotRefresh(res);
                            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != "") {
                                if (res.type === "success") {
                                    setTimeout(function () {
                                        window.location.href = redirectUrl;
                                    }, 1000);
                                }
                            }
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    });
                $(".modal-draggable").draggable({ handle: '.modal-header' });
                return false;
            } else {
                CommonJs.ShowConfirmMsg2(
                    confirmHeader,
                    confirmMessage,
                    //'Bạn không thể phục hồi dữ liệu đã xóa',
                    comfimTitle || 'Đồng ý',
                    closeTitle || 'Hủy',
                    function () {
                        let someData = {};
                        let method = "POST";
                        let ssCallBack = function (res) {
                            CommonJs.SetMessageNotRefresh(res);
                            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != "") {
                                if (res.type === "success") {
                                    setTimeout(function () {
                                        window.location.href = redirectUrl;
                                    }, 1000);
                                }
                            }
                        };
                        CommonJs.CustAjaxCall(someData, method, url, "json", ssCallBack, "");
                    }, url);
                $(".modal-draggable").draggable({ handle: '.modal-header' });
                return false;
            }


        });

        jQuery(document).on("click", ".quickView", function () {
            let url = $(this).attr("href");
            let directUrl = $(this).attr("redirect-url");
            $.ajax(
                {
                    url: url,
                    type: "POST",
                    success: function (res) {
                        window.location.href = directUrl;
                    }
                }
            );

            //CommonJs.CustAjaxCall(formData, "POST", url, dataType, ssCallBack, errCallback);
            return false;
        });

        jQuery(document).on("change", ".onSelectChange", function () {

            var obj = jQuery(this);
            var target = jQuery(obj.attr("data-target"));
            let ssCallBack = function (res) {
                target.html(res.data);
                CommonJs.UpdateSelect2(target);

                if (target.val() > 0 && target.hasClass("onSelectChange")) {
                    target.trigger("change");
                }
            }
            var data = {
                SelectedID: obj.val(),
                TargetSelectedID: target.val(),
                DefaultText: target.attr("data-default-text")
            };
            CommonJs.CustAjaxCall(data, "POST", obj.attr("data-url"), null, ssCallBack, null);
        });


        jQuery(document).on("click", ".toogleExpand", function () {
            let target = $(this).attr("data-target");
            $(target).slideToggle();
        });
    },

    ToggleMultiTicks: function (table) {
        var flag = false;
        var fullcheck = true;
        var wrapper = table.closest(".wrapper_dataTables");
        var actions = wrapper.find(".actMultiTicks");
        var buttons = actions.find(".btn");
        var grouper = wrapper.find(".group-checkable");
        table.find(".checkboxes").each(function () {
            if (jQuery(this).prop("checked")) {
                actions.removeClass("hidden");
                buttons.removeClass("disabled").prop("disabled", false);
                flag = true;
            }
            if (!jQuery(this).prop("checked")) {
                fullcheck = false;
            }
        });
        if (!flag) {
            actions.addClass("hidden");
            buttons.addClass("disabled").prop("disabled", true);
            if (grouper.prop("checked"))
                grouper.prop("checked", false);
        }
        if (fullcheck) {
            grouper.prop("checked", true);
        } else {
            grouper.prop("checked", false);
        }
    },
    UpdateFormState: function (container) {

        var flag = false;
        if (container.hasClass("validateForm")) {
            flag = true;
            CommonJs.BootstrapValidator(container);
        }
        container.find(".validateForm").each(function () {
            flag = true;
            CommonJs.BootstrapValidator(jQuery(this));
        });
        container.find(".form-control textarea:visible, .form-control input[type='text']:visible").each(function () {
            if (CommonJs.IsEmpty(jQuery(this).val())) {
                jQuery(this).focus();
                return false;
            }
        });
        container.find("select").unbind("mousewheel").bind("mousewheel", "select", function (e) {
            e.stopPropagation();
        });

        if (flag == false) {
            var form = container.closest("form");
            if (form.hasClass("bootstrapValidator")) {
                container.find("[data-bv-field]").each(function () {
                    var name = jQuery(this).attr("data-bv-field");
                    var options = container.find('[name="' + name + '"]');
                    form.bootstrapValidator('addField', options);
                });
            }
        }
    },
    ValidateForm: function (form) {
        if (form.hasClass("validateForm")) {
            CommonJs.BootstrapValidator(form);
        }
    },
    BootstrapValidator: function (obj) {
        if (!obj.hasClass("bootstrapValidator")) {
            obj.addClass("bootstrapValidator").bootstrapValidator({
                excluded: [':disabled', ':hidden', ':not(:visible)', '.IgnoredValid'],

            });
        }
    },
    DestroyValidator: function (container) {
        try {
            if (container.hasClass("bootstrapValidator")) {
                container.removeClass("bootstrapValidator").bootstrapValidator('destroy');
            }
        }
        catch (e) {
        }
    },
    ValidateDataForm: function (form) {

        form.find("input[type='text'], input[type='password'], textarea,input[type='time'], select").each(function () {

            var num = jQuery(this).removeClass("error").val();
            num = CommonJs.RemoveSpace(num);

            if (jQuery(this).hasClass('checkngay')) {
                if (!CommonJs.IsEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) > 31 || parseInt(num) < 1) {
                        jQuery(this).addClass("error");
                    } else {
                        if (num.length == 1) {
                            num = "0" + num;
                        }
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checkthang')) {
                if (!CommonJs.IsEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) > 12 || parseInt(num) < 1) {
                        jQuery(this).addClass("error");
                    } else {
                        if (num.length == 1) {
                            num = "0" + num;
                        }
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checknam')) {
                if (!CommonJs.IsEmpty(num)) {
                    if (!jQuery.isNumeric(num) || parseInt(num) < 1900 || parseInt(num) > 2015) {
                        jQuery(this).addClass("error");
                    } else {
                        jQuery(this).val(num);
                    }
                }
            }
            else if (jQuery(this).hasClass('checkint')) {
                if (!CommonJs.IsEmpty(num)) {
                    if (!jQuery.isNumeric(num) || num.indexOf(".") != -1 || num.indexOf(",") != -1) {
                        jQuery(this).addClass("error");
                    } else {
                        jQuery(this).val(num);
                    }
                }
            }

            if (jQuery(this).hasClass('checkrequired')) {
                if (CommonJs.IsEmpty(num)) {
                    jQuery(this).addClass("error");
                }
                else if (jQuery(this).prop("tagName") == "SELECT" && num == "0") {
                    jQuery(this).addClass("error");
                }
            }

            if (jQuery(this).hasClass('checkcompare')) {

                var comparator = jQuery(jQuery(this).attr("data-compare"));
                var valCompare = comparator.val();
                if (valCompare != num) {
                    jQuery(this).addClass("error");
                    comparator.addClass("error");
                }
            }
        });

        var elErrors = form.find(".error");
        if (elErrors.length > 0) {
            var messages = [];
            elErrors.each(function () {
                var data = jQuery(this).getDataUppername();
                if (!CommonJs.IsEmpty(data.MessageNotEmpty))
                    messages.push(data.MessageNotEmpty);
            });
            if (messages.length > 0) {
                alert(messages.join("\n"));
            }
            var elError = elErrors.first().focus();
            if (!elError.is(":visible")) {
                elError.closest(".group-tab").find(".tab-data").addClass("hidden");
                var idTab = elError.closest(".tab-data").removeClass("hidden").attr("id");

                elError.closest(".group-tab").find(".tabitem").removeClass("active");
                elError.closest(".group-tab").find(".tabitem[data-tab='#" + idTab + "']").addClass("active");
            }
            return false;
        }
        return true;
    },
    RemoveSpace: function (val) {
        try {
            while (val.indexOf(" ") !== -1) {
                val = val.replace(" ", "");
            }
        } catch (e) { }
        return val;
    },
    UpdateTreeGrid: function (container) {

        if (CommonJs.IsEmpty(container))
            container = jQuery(document);

        container.find(".useTreegrid").each(function () {
            var number = $(this).attr("data-tree");
            var initState = 'expanded';
            if (jQuery(this).attr('data-initcollapsed') == 'true') {
                initState = 'collapsed';
            }
            jQuery(this).treegrid({
                treeColumn: number,
                initialState: initState
            });
        });
    },

    BuilderQString: function (data) {
        var queries = [];
        for (var i in data) {
            if (i == "__RequestVerificationToken")
                continue;
            if (!CommonJs.IsEmpty(data[i]) && (data[i] > -1 || data[i].indexOf(',') > -1)) {
                queries.push(i + "=" + data[i]);
            }
        }
        return ("?" + queries.join("&"));
    },
    BuilderQStringFull: function (data) {
        var queries = [];
        for (var i in data) {
            if (i == "__RequestVerificationToken")
                continue;
            if (!CommonJs.IsEmpty(data[i])) {
                queries.push(i + "=" + data[i]);
            }
        }
        return ("?" + queries.join("&"));
    },
    FormBuilderQString: function (form, fdata) {
        var data = {};
        form.find("input, select, textarea, button").each(function () {
            var el = jQuery(this);
            var name = el.prop("name");
            if (!CommonJs.IsEmpty(name)) {
                var tagName = el.prop("tagName").toLowerCase();
                if (tagName == "input") {
                    var type = el.prop("type").toLowerCase();
                    if (type == "text" || type == "password" || type == "hidden" || type == "number") {
                        if (!data.hasOwnProperty(name)) {
                            data[name] = [];
                        }
                        if (!CommonJs.IsEmpty(el.val()))
                            el.val(el.val().trim());
                        data[name].push(el.val());
                    } else if (type == "checkbox") {
                        if (!data.hasOwnProperty(name)) {
                            data[name] = [];
                        }
                        if (el.prop("checked")) {
                            data[name].push(el.val());
                        }
                        else {
                            data[name].push(0);
                        }
                        //if (!checkboxs.hasOwnProperty(name)) {
                        //    checkboxs[name] = 0;
                        //}
                        //checkboxs[name]++;
                    } else if (type == "radio") {
                        if (!data.hasOwnProperty(name)) {
                            data[name] = [];
                        }
                        if (el.prop("checked")) {
                            data[name].push(el.val());
                        }
                    }
                }
                else if (tagName == "select") {
                    if (!CommonJs.IsEmpty(el.val()) && (parseInt(el.val()) > -1 || el.val().indexOf(",") > -1)) {
                        data[name] = [];
                        data[name].push(el.val());
                    }
                }
                else if (tagName != "button") {
                    if (!data.hasOwnProperty(name)) {
                        data[name] = [];
                    }
                    data[name].push(el.val());
                }
            }
        });
        for (var k in data) {
            var vals = data[k];
            if (vals.length == 1) { //|| !checkboxs.hasOwnProperty(k)
                data[k] = vals.join(",");
            } else {
                data[k] = JSON.stringify(vals);
            }
        }
        if (fdata != undefined) {
            //add paging params
            if (fdata["pageIndex"])
                data["pageIndex"] = fdata["pageIndex"];
            if (fdata["pageSize"])
                data["pageSize"] = fdata["pageSize"];
        }

        var queries = [];
        for (var i in data) {
            if (i == "__RequestVerificationToken")
                continue;
            if (!CommonJs.IsEmpty(data[i])) {
                queries.push(i + "=" + data[i]);
            }
        }
        var indexOfQuestionMark = window.location.href.indexOf('?');
        if (indexOfQuestionMark >= 0) {
            var strQuery = window.location.href.slice(window.location.href.indexOf('?') + 1);
            if (strQuery !== '') {
                var hashes = strQuery.split('&');
                for (let i = 0; i < hashes.length; i++) {
                    var hash = hashes[i].split('=');
                    if (!data.hasOwnProperty(hash[0])) {
                        queries.unshift(hash[0] + "=" + hash[1]);
                    }
                }
            }
        }

        return ("?" + queries.join("&"));
    },

    DateTimeFormat: function (position) {
        var datePicker = $('.date_input');
        var format = datePicker.attr("data-format");
        if (CommonJs.IsEmpty(format)) {
            format = 'DD/MM/yyyy';
        }
        format = format.replace("dd", "DD");
        var prepend = datePicker.find('input-group-prepend').length > 0;
        var append = datePicker.find('input-group-append').length > 0;
        position = position || (prepend ? 'left' : append ? 'right' : 'left');
        //Date picker
        datePicker.length > 0 && datePicker.datetimepicker({
            format: format,
            locale: moment.locale('vi'),
            dayViewHeaderFormat: 'MMM YYYY',
            widgetPositioning: {
                horizontal: position,
                vertical: 'auto'
            },
            buttons: {
                showToday: true,
                showClear: true,
                showClose: true
            },
            icons: {
                today: 'fa fa-calendar-check'
            },
            //days: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
            //daysShort: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
            //daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            //months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            //monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
            tooltips: {
                today: 'Tới hôm nay',
                clear: 'Xóa',
                close: 'Đóng',
                selectMonth: 'Chọn tháng',
                prevMonth: 'Tháng trước',
                nextMonth: 'Tháng sau',
                selectYear: 'Chọn năm',
                prevYear: 'Năm trước',
                nextYear: 'Năm sau',
                selectDecade: 'Chọn thập kỷ',
                prevDecade: 'Thập kỷ trước',
                nextDecade: 'Thập kỷ sau',
                prevCentury: 'Thế kỷ trước',
                nextCentury: 'Thế kỷ sau',
                pickHour: 'Chọn giờ',
                incrementHour: 'Tăng giờ',
                decrementHour: 'Giảm giờ',
                pickMinute: 'Chọn phút',
                incrementMinute: 'Tăng phút',
                decrementMinute: 'Giảm phút',
                pickSecond: 'Chọn giây',
                incrementSecond: 'Tămg giây',
                decrementSecond: 'Giảm giây',
                togglePeriod: 'Toggle Period',
                selectTime: 'Chọn thời gian',
                selectDate: 'Chọn ngày'
            },
            debug: false
        });
        var dateRange = $('.date_range');
        //Date range picker
        dateRange.length > 0 && dateRange.daterangepicker({
            locale: {
                format: 'DD/MM/yyyy',
                applyLabel: 'Chọn',
                cancelLabel: 'Hủy'
            }
        });
    },
    UpdateInputMoney: function (container) {
        try {
            if (container == undefined)
                container = jQuery(document);
            container.find('.useMoney').simpleMoneyFormat();
            container.find(".useMoney").each(function () {
                $(this).keyup(function () {
                    this.value = CommonJs.FormatMoney(this.value);
                });
            });
        } catch (e) {

        }
    },
    FormatMoney: function (n) {
        var i, f;
        if (n != null) {
            var t = n.toString().replace(".", ""), r = !1, u = [], e = 1, o = null;
            for (t.indexOf(".") > 0 && (r = t.split("."), t = r[0]), t = t.split("").reverse(), i = 0, f = t.length; i < f; i++) t[i] != "," && (u.push(t[i]), e % 3 == 0 && i < f - 1 && u.push(","), e++);
            return o = u.reverse().join(""), o + (r ? "." + r[1].substr(0, 2) : "");
        }
        return n;
    },
    UpdateIsNumber: function (container) {
        if (container == undefined)
            container = jQuery(document);
        //$('.isNumberInteger, .isNumber').on("paste", function (e) {
        //    e.preventDefault(); 
        //});
        $('.isNumber').keypress(function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (
                (charCode != 45 && charCode != 8 || $(this).val().indexOf('-') != -1) && // “-” CHECK MINUS, AND ONLY ONE.
                (charCode != 46 || $(this).val().indexOf('.') != -1) && // “.” CHECK DOT, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
                return false;
            if ($(this).val().indexOf('0') == 0 && $(this).val() != "") { //Remove 0 first
                $(this).val($(this).val().replace("0", ""));
            }
            return true;
        });
        $('.isNumberDecimal').keypress(function (e) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (
                (charCode != 45 && charCode != 8 || jQuery(this).hasClass("isPositiveNumber") || $(this).val().indexOf('-') != -1) // “-” CHECK MINUS, AND ONLY ONE, IS Positive Number
                && (charCode < 48 || charCode > 57) && charCode != 46)
                return false;

            if ($(this).val().indexOf('-') > 0) { //Move - to end index
                $(this).val("-" + $(this).val().replace("-", ""));
            }
            if (jQuery(this).hasClass("notUseZero")) {
                if ($(this).val().indexOf('0') == 0 && $(this).val() != "") { //Remove 0 first
                    $(this).val($(this).val().replace("0", ""));
                }
            }
            if ($(this).val().indexOf('.') > 0 && charCode === 46) {
                $(this).val($(this).val().replaceAll(".", "") + ".");
                return false;
            }
            return true;
        });
        $('.isNumberInteger').keypress(function (e) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (
                (charCode != 45 && charCode != 8 || jQuery(this).hasClass("isPositiveNumber") || $(this).val().indexOf('-') != -1) // “-” CHECK MINUS, AND ONLY ONE, IS Positive Number
                && (charCode < 48 || charCode > 57))
                return false;

            if ($(this).val().indexOf('-') > 0) { //Move - to first index
                $(this).val("-" + $(this).val().replace("-", ""));
            }
            if ($(this).val().indexOf('0') == 0 && $(this).val() != "") { //Remove 0 first
                $(this).val($(this).val().replace("0", ""));
            }
            return true;
        });
        $('.isNumberInteger').change(function (e) {
            if (jQuery(this).hasClass("useMoney"))
                $(this).val($(this).val().replace(/[^0-9\-,]/g, ""));
            else
                $(this).val($(this).val().replace(/[^0-9\-]/g, ""));
            //Move - to first index
            if ($(this).val().indexOf('-') > 0) {
                $(this).val("-" + $(this).val().replace("-", ""));
            }

        });
        $('.isPositiveNumber').change(function (e) {
            $(this).val($(this).val().replace(/[^0-9]/g, ""));
        });
        $('.isInputOnlyNumber').keypress(function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57))
                return false;
            return true;
        });
        $('.isInputOnlyNumber').change(function (e) {
            $(this).val($(this).val().replace(/[^0-9]/g, ""));
        });
    },
    /**
     * activeSidebarMenu
     */
    activeSidebarMenu: function () {
        /**
         * Remove trail of url
         * @param {string} url
         * @returns {string}
         */
        const _removeTrail = function (url) {
            //Get the trailer position of url
            let i = url.indexOf('?');
            let j = url.indexOf('#');
            const trailer = (i > 0 && j > 0) ? Math.min(i, j) : Math.max(i, j);
            //Remove the trailer if exist
            return (trailer !== -1) ? url.substring(0, trailer) : url;
        }
        const sidebar = document.getElementsByClassName('nav-sidebar')[0];
        //Check if sidebar exist
        if (!sidebar || sidebar.length == 0) {
            return false;
        }
        //Check if sidebar is multilevel
        const treeViews = sidebar.getElementsByClassName('nav-treeview');
        if (treeViews.length == 0) {
            return false;
        }
        //update by BreadCrumb
        let url = _removeTrail(window.location.href.toLowerCase());
        let check = true;
        if (document.getElementById('breadcrumb')) {
            const breadcrumb = document.getElementById('breadcrumb').getElementsByTagName("li");
            if (breadcrumb != null) {
                var listUrl = [];
                for (let liItem of breadcrumb) {
                    let item = liItem.firstElementChild;
                    if (item != null && item.href) {
                        let href = item.href.toLowerCase();
                        listUrl.push(href);
                    }
                }
                while ((a = listUrl.pop()) != null) {
                    if (!check) break;
                    for (let tree of treeViews) {
                        let items = tree.children;
                        let toggler = tree.previousElementSibling;
                        toggler.classList.remove('active');
                        for (let item of items) {
                            let link = item.firstElementChild;
                            let list = item.parentElement.parentElement;
                            let href = link.href.toLowerCase();
                            link.classList.remove('active');
                            if (a === href) {
                                link.classList.add('active');
                                toggler.classList.add('active');
                                list.classList.add('menu-open');
                                check = false;
                            }
                        }
                    }
                }
            }
        }
        while (check) {
            for (let tree of treeViews) {
                let items = tree.children;
                let toggler = tree.previousElementSibling;
                toggler.classList.remove('active');
                for (let item of items) {
                    let link = item.firstElementChild;
                    let list = item.parentElement.parentElement;
                    let href = link.href.toLowerCase();
                    link.classList.remove('active');
                    if (url === href) {
                        link.classList.add('active');
                        toggler.classList.add('active');
                        list.classList.add('menu-open');
                        check = false;
                    }
                }
            }
            if (check) {
                if (url.lastIndexOf('/') < 0) check = false;
                else
                    url = url.substr(0, url.lastIndexOf('/'));
            }
        };
    },
    /**
     * DataTableSizing
     */
    DataTableSizing: function () {
        const $tables = $('.data_table');
        $tables.length !== 0 && $tables.each(function () {
            const $table = $(this);
            $table.find('th').each(function (index) {
                $table.find(` > tbody > tr:not(.expandable-body) > td:nth-child(${index + 1})`).addClass($(this).attr('class'));
            });
        });
    },
    FixSearchDropdown: function () {
        //'.quickSearch' only
        var form = $('.quickSearch');
        var menu = form.find('.dropdown-menu');
        var toggler = form.find('.dropdown-toggle');
        var eventTrigger = menu.parent();
        var isFilterChanged = false;  //Initial filter status
        let data = CommonJs.GetSerialize2(form);

        var search_reset = menu.find('[type="reset"]');
        var search_confirm = menu.find('[type="button"]');
        var search_select = menu.find('.select2, .date_input');

        var group = form.find('.table-control > .input-group');
        var search = form.find('[aria-describedby="search-addon"]');
        group.prepend(search);
        menu.children().length == 1 && menu.parent().remove();

        search_select.on('change change.datetimepicker', function (e) {
            isFilterChanged = true; //Filter has something changed
            console.log(e.type + this.value);
        });

        //Manual set size of dropdown popup
        menu.css({ 'min-width': 320, 'max-height': 500 });

        //Stop dropdown hide when click inside
        menu.on('click', function (event) {
            var events = $._data(document, 'events') || {};
            events = events.click || [];
            for (var i = 0; i < events.length; i++) {
                if (events[i].selector) {
                    //Check if the clicked element matches the event selector
                    if ($(event.target).is(events[i].selector)) { events[i].handler.call(event.target, event) }
                    // Check if any of the clicked element parents matches the delegated event selector (Emulating propagation)
                    $(event.target).parents(events[i].selector).each(function () { events[i].handler.call(this, event) });
                }
            }
            event.stopPropagation(); //Always stop propagation
        });

        var template = $('<div />', { class: 'lazyload-overlay', }); //backdrop template
        //Callback when Dropdown is show
        eventTrigger.on('show.bs.dropdown', function () {
            $('.content-wrapper').append(template); //add backdrop
        });
        //Callback when Dropdown is hidden
        eventTrigger.on('hidden.bs.dropdown', function () {
            //remove backdrop
            template.remove();
            search_confirm.trigger('click');
        });
        search_reset.on('click', function () {
            search_select.val(-1).trigger('change');
        });
        search_confirm.on('click', function () {
            //Submit search form when dropdown is hidden and filter changed
            if (isFilterChanged) {
                form.submit();
                isFilterChanged = false; //reset status
                //window.history.pushState(null, null, CommonJs.FormBuilderQString(form, data));
            }
            toggler.dropdown('hide');
        });
    },
    //FrontEndFunctionsNeedToReRun: function () {
    //    CommonJs.DataTableSizing();
    //    $('.breadcrumb [data-toggle="tooltip"]').tooltip({
    //        html: true,
    //        //container: '.content-wrapper',
    //        placement: 'right',
    //        boundary: 'window',
    //        trigger: 'hover'
    //    });
    //    $('.dashboard [data-toggle="tooltip"]').tooltip();
    //    $('.data_table [data-toggle="tooltip"]').tooltip({
    //        html: true,
    //        container: '.content-wrapper',
    //        placement: 'top',
    //        boundary: 'window',
    //        trigger: 'hover'
    //    });
    //    $('.documenting [data-toggle="tooltip"]').tooltip({
    //        placement: 'right',
    //        boundary: 'window',
    //    });
    //},
    /**
     * Lazyload for $.ajax `beforeSend` callback
     * Applied to CustAjaxCall; QuickActions: quickSearch, quickUpdate, onSetPageIndex, onChangePageSize
     */
    LazyLoadAjax: function () {
        var lazyload = new CommonJs.lazyload($('.content-wrapper'));
        lazyload.show();
        $(document).on('ajaxComplete', function () {
            lazyload.hide();
        });
    },
    /**
     * Lazyload
     * @param {object} container jQuery Element
     */
    lazyload: function (container) {
        container = container || $('.content-wrapper');

        var overlay = document.getElementById('loadingOverlay');

        return {
            show: function () {
                overlay.classList.remove('hidden');
            },
            hide: function () {
                overlay.classList.add('hidden');
            }
        };
    },
    UpdateQueryStringParameter: function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    },

    GetUrlParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    },

    //Nhấn Esc close modal đang mở
    PressEscapeCloseModal: function () {
        jQuery(document).on("keydown", function (e) {
            let keyCode = e.keyCode;
            if (keyCode === 27) {//keycode is an Integer, not a String
                jQuery(".modal:visible").modal('toggle');
            }
        });
    },
    GetDomain: function () {

        var domain = window.location.protocol
        domain += "//";
        domain += window.location.hostname;
        if (window.location.port !== "") {
            domain += ":";
            domain += window.location.port;
        }
        return domain;
    },

    FormatPassword: function () {
        $("input[type=password]").keydown(function (e) {
            if (e.keyCode == 32)
                return false;
        })
    },

    OpenModal: function (md) {
        var cmodals = jQuery(".modal:visible:not('#" + md.attr("id") + "')");
        if (cmodals.length > 0) {
            //var zIndex = cmodals.css("z-index");
            //cmodals.css("z-index", 1000).attr("data-z-index", zIndex); //Cho zIndex nhỏ hơn
            cmodals.addClass("hide-modal").hide();
        }
        md.modal({
            backdrop: 'static', //Click outside
            //keyboard: true, //Esc
            show: true
        }).on('hidden.bs.modal', function () {
            var hideModal = jQuery(".modal.hide-modal:hidden:first");
            if (hideModal.length > 0)
                hideModal.removeClass("hide-modal").show();
        });
        $(".modal-draggable").draggable({ handle: '.modal-header' });
    },


    ResumableUpload: function (input, fileType, targetControllerAction, callback) {
        var r = new Resumable({
            target: targetControllerAction,
            query: {},
            maxChunkRetries: 2,
            maxFiles: 3,
            prioritizeFirstAndLastChunk: true,
            simultaneousUploads: 4,
            chunkSize: CommonJs.chunkSize,
            testChunks: false,
            fileType: fileType //Xem trong EnumFile
        });

        r.assignBrowse(input);

        r.on('fileSuccess', function (file, message) {
            console.debug('fileSuccess', file);
            return callback(message);
            //return Response from Server after Upload File Success s
        });

        r.on('fileProgress', function (file) {
            console.debug('fileProgress', file);
        });

        r.on('fileAdded', function (file, event) {
            r.upload();
            console.debug('fileAdded', event);
        });
        r.on('filesAdded', function (array) {
            r.upload();
            console.debug('filesAdded', array);
        });
        r.on('fileRetry', function (file) {
            console.debug('fileRetry', file);
        });
        r.on('fileError', function (file, message) {
            console.debug('fileError', file, message);
        });
        r.on('uploadStart', function () {
            console.debug('uploadStart');
        });
        r.on('complete', function () {
            console.debug('complete');
        });
        r.on('progress', function () {
            console.debug('progress');
        });
        r.on('error', function (message, file) {
            console.debug('error', message, file);
        });
        r.on('pause', function () {
            console.debug('pause');
        });
        r.on('cancel', function () {
            console.debug('cancel');
        });
    }
}

jQuery.fn.extend({
    reset: function () {
        try {
            this.each(function () {
                this.reset();
            });
            jQuery(jQuery(this).attr("data-html-reset")).html("");
        } catch (e) {
        }
        jQuery(this).find(".isNew").remove();
    },
    getData: function () {
        var data = {};
        try {
            this.each(function () {
                jQuery.each(this.attributes, function () {
                    var name = this.name.toLowerCase();
                    if (name.indexOf("data-") === 0) {
                        var k = "";
                        var args = name.split("-");
                        for (var n = 0; n < args.length; n++) {
                            if (n == 0) continue;
                            if (n == 1) {
                                k += args[n];
                            }
                            else {
                                k += args[n].capitalize()
                            }
                        }
                        data[k] = this.value;
                    }
                });
            });
        } catch (e) {
        }
        return data;
    },
    getDataUppername: function () {
        var data = {};
        try {
            this.each(function () {
                jQuery.each(this.attributes, function () {
                    var name = this.name.toLowerCase();
                    if (name.indexOf("data-") === 0) {
                        var k = "";
                        var args = name.split("-");
                        for (var n = 0; n < args.length; n++) {
                            if (n == 0) continue;
                            var v = args[n];
                            if (v == "id") {
                                k += v.toUpperCase();
                            }
                            else {
                                k += v.capitalize()
                            }
                        }
                        data[k] = this.value;
                    }
                });
            });
        } catch (e) {
        }
        return data;
    },
    replaceAll: function (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    },

});
var InitCommonJs = function () {
    CommonJs.ShowNotifyMsg();
    CommonJs.QuickSubmitJS();
    CommonJs.Select2Init();
    CommonJs.ActiveMagnificPopup();
    CommonJs.QuickActions();
    CommonJs.UpdateTreeGrid();
    CommonJs.DateTimeFormat();
    CommonJs.UpdateInputMoney();
    CommonJs.UpdateIsNumber();
    CommonJs.UpdateFormState(jQuery(document));
    CommonJs.PressEscapeCloseModal();
    CommonJs.FixSearchDropdown();
    //CommonJs.FrontEndFunctionsNeedToReRun();
    CommonJs.activeSidebarMenu();
    CommonJs.ConfigDataTable();
    jQuery(function ($) {

        //function formatCountry(country) {
        //    if (!country.id) { return country.text; }
        //    var $country = $(
        //        '<span class="flag-icon flag-icon-' + country.id.toLowerCase() + ' flag-icon-squared"></span>' +
        //        '<span class="flag-text">' + country.text + "</span>"
        //    );
        //    return $country;
        //};
        //$("[name='culture']").select2({
        //    autoWidth: true,
        //    placeholder: "Please Select a country",
        //    templateResult: formatCountry,
        //});




        //Fix bug nhấn back trên trình duyệt thì load lại trang
        //if (window.history && window.history.pushState) {
        //    $(window).on('popstate', function () {
        //        window.location.reload();
        //    });
        //}
        //$('.notification_list , .documenting .card-body').overlayScrollbars({
        //    className: 'os-theme-dark',
        //    sizeAutoCapable: true,
        //    scrollbars: {
        //        clickScrolling: true
        //    },
        //    overflowBehavior: {
        //        x: 'hidden'
        //    }
        //});
        //$('.table-responsive').overlayScrollbars({
        //    className: 'os-theme-dark',
        //    sizeAutoCapable: true,
        //    scrollbars: {
        //        clickScrolling: true
        //    }
        //});
    });
}

jQuery(window).on('ajaxComplete', function () {
    //CommonJs.FrontEndFunctionsNeedToReRun();
});
