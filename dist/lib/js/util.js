/**
 * Created by dsky on 16/6/22.
 * common function we need in project, use by util.functionName()
 * dateTimePicker function to slove datePicker problem
 * zTree function to tree dom
 * dataTable function to slove dates in table
 * initValidatorFrom function to init Validatoion
 * popover function to show with popover
 */
var util = (function () {
    return {
        init: function (dataTableOption) {
            var _this = this;
            if ($('.datetimepicker').length) {
                _this.dateTimePicker();
            }
            if (dataTableOption) {
                _this.dataTable(dataTableOption);
            }
            if ($('a[data-num]').length) {
                _this.linkTab();
            }
            if ($('.search-more').length) {
                _this.searchBtn();
            }
        },
        dateTimePicker: function () { // dateTimePicker
            $('.datetimepicker').datetimepicker({
                useCurrent: false,
                showClear: true,
                showTodayButton: true,
                format: 'YYYY-MM-DD H:mm:ss',
                tooltips: {
                    today: '选择今天',
                    clear: '清除时间',
                    selectMonth: '选择月份',
                    prevMonth: '前一个月',
                    nextMonth: '后一个月',
                    selectYear: '选择年份',
                    prevYear: '前一年',
                    nextYear: '后一年',
                    selectTime: '选择时间'
                }
            });
            $('.datetimepicker').on('dp.show', function () {
                var $this = $(this),
                    isSecond;
                isSecond = $this.data('second');
                if (isSecond === 'no') {
                    $this.find('.glyphicon-time').hide();
                    $this.data('DateTimePicker').format('YYYY-MM-DD');
                }
            });
            $('.datetimepicker').on('dp.change', function (e) {
                var $this = $(this),
                    $par,
                    date,
                    dateRange;
                $par = $this.parents('.datetimepicker_moudle');
                if ($('.datetimepicker').length > 1 && $par) {
                    date = e.date;
                    dateRange = $this.data('datetimepicker');
                    switch (dateRange) {
                        case 'start' :
                            $par.find('.datetimepicker').eq(1).data('DateTimePicker').minDate(date);
                            break;
                        case 'end' :
                            $par.find('.datetimepicker').eq(0).data('DateTimePicker').maxDate(date);
                            break;
                        // no default
                    }
                }
            });
        },
        zTree: function (option) {
            var setting,
                zNodes;
            // zTree的参数配置，深入使用请参考 API 文档（setting 配置详解）
            setting = {
                check: {
                    enable: true,
                    chkDisabledInherit: true,
                    chkboxType: {'Y': 'ps', 'N': 'ps'}
                },
                view: {
                    showIcon: false
                }
            };
            // zTree的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
            zNodes = option;
            $.fn.zTree.init($('#treeDemo'), setting, zNodes);
            // zTreeObj = $.fn.zTree.init($('#treeDemo'), setting, zNodes);
        },
        dataTable: function (option) {
            var scrollNum,
                scrollBody,
                scrollHead;
            // dataTable 默认配置
            $.extend($.fn.dataTable.defaults, {
                'processing': true,
                // "dom": 'rt<"clear"iflp>',
                'searching': false,
                'ordering': false,
                'scrollX': true,
                'serverSide': true,
                'language': {
                    'sProcessing': '处理中...',
                    'sLengthMenu': '显示 _MENU_ 项结果',
                    'sZeroRecords': '没有匹配结果',
                    'sInfo': '显示第 _START_ 至 _END_ 页结果，共 _TOTAL_ 条',
                    'sInfoEmpty': '显示第 0 至 0 页结果，共 0 条',
                    'sInfoFiltered': '(由 _MAX_ 项结果过滤)',
                    'sInfoPostFix': '',
                    'sSearch': '搜索:',
                    'sUrl': '',
                    'sEmptyTable': '表中数据为空',
                    'sLoadingRecords': '载入中...',
                    'sInfoThousands': ',',
                    'oPaginate': {
                        'sFirst': '首页',
                        'sPrevious': '上页',
                        'sNext': '下页',
                        'sLast': '末页'
                    },
                    'oAria': {
                        'sSortAscending': ': 以升序排列此列',
                        'sSortDescending': ': 以降序排列此列'
                    }
                },
                'drawCallback': function () {
                    parent.iFrameHeight();
                }
            });
            $(option.ele).DataTable({
                'ajax': option.ajax,
                'columns': option.columns,
                'drawCallback': option.drawCallback
            });
            scrollNum = $(option.ele).data('scroll');
            scrollBody = $(option.ele).parents('.dataTables_scroll').find('.dataTables_scrollBody');
            scrollHead = $(option.ele).parents('.dataTables_scroll').find('.dataTables_scrollHead');
            if (scrollNum) {
                $(scrollBody).scroll(function () {
                    var $this = $(this),
                        scrollLeft;
                    scrollLeft = $this.scrollLeft();
                    if (!$('th').hasClass('scroll')) {
                        $(scrollHead).find('tr').children('th:lt(' + scrollNum + ')').addClass('scroll');
                        $(scrollBody).find('tr').each(function () {
                            $(this).children('td:lt(' + scrollNum + ')').addClass('scroll');
                        });
                    }
                    $('.scroll').css({
                        'left': scrollLeft,
                        'z-index': 9
                    });
                });
            }
        },
        searchBtn: function () {
            (function () {
                $(document).on('click', '.search-more', function () {
                    var $btn = $(this),
                        $toolbar = $btn.parents('.toolbar');
                    $toolbar.toggleClass('active');
                });
            }());
        },
        initValidatorFrom: function (option) { // 初始化配置
            var _this = this,
                _popover,
                i,
                cnt,
                elements;
            $.validator.setDefaults({
                ignore: ''
            });
            // handle elements with the same name
            jQuery.validator.prototype.checkForm = function () {
                this.prepareForm();
                for (i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    if (this.findByName(elements[i].name).length !== undefined && this.findByName(elements[i].name).length > 1) {
                        for (cnt = 0; cnt < this.findByName(elements[i].name).length; cnt++) {
                            this.check(this.findByName(elements[i].name)[cnt]);
                        }
                    } else {
                        this.check(elements[i]);
                    }
                }
                return this.valid();
            };
            $(option.ele).validate({
                validClass: 'success',
                // onkeyup: true,
                onfocusout: function (element) {
                    this.element(element);
                },
                showErrors: function (errorMap, errorList) {
                    $.each(this.successList, function (index, value) {
                        $(value).removeClass('error').addClass('success');
                        return $(value).popover('hide');
                    });
                    return $.each(errorList, function (index, value) {
                        $(value.element).removeClass('success').addClass('error');
                        _popover = $(value.element).popover({
                            trigger: 'manual',
                            placement: 'bottom',
                            content: value.message,
                            template: '<div class=\"popover\"><div class=\"arrow\"></div><div class=\"popover-inner\"><div class=\"popover-content\"><p></p></div></div></div>'
                        });
                        _popover.data('bs.popover').options.content = value.message;
                        return $(value.element).popover('show');
                    });
                },
                rules: option.rules,
                messages: option.messages,
                submitHandler: function (form) { // 验证完成进行提交
                    switch (option.submitType) {
                        case 'submit':
                            _this.onValidatorFormSubmit(form);
                            break;
                        case 'post':
                            _this.onValidatorFormPost(option);
                            break;
                        case 'auto':
                            option.validateDone(form);
                            break;
                        // no default
                    }
                }
            });
        },
        onValidatorFormSubmit: function (form) { // 提交from
            form.submit();
        },
        onValidatorFormPost: function (option) {
            $.post(option.postUrl, $(option.ele).serialize())
                    .done(function (data) {
                        option.postDone(data);
                    });
        },
        popover: function (ele, mes ,state) {
            var _popover;
            _popover = ele.popover({
                trigger: 'manual',
                placement: 'bottom',
                content: mes,
                template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
            });
            _popover.data('bs.popover').options.content = mes;
            if (state === 'show') {
                return ele.popover('show');
            }
            return ele.popover('hide');
        },
        linkTab: function () {
            /**
             * Created by Henrietta S.
             * it can open links as frames in index page
             * link requires "data-num" (must be "0") to bind with the function
             * "data-name", "data-mul" and "data-reload" are optional
             */
            $.extend({
                // 刷新iframe高度
                iFrameHeight: function () {
                    var ifm = $('.tab-panel.active iframe')[0],
                        subWeb = $(document).frames ? $(document).frames.iframepage.document : ifm.contentDocument;
                    if (ifm != null && subWeb != null) {
                        ifm.height = subWeb.body.scrollHeight;
                    }
                }
            });
            (function () {
                var tnum = 0;
                $(document).on('mouseup touchend', 'a[data-num]', function () { // 任意位置的超鏈接
                    var $this = $(this),
                        link = $this.attr('href'),
                        name = $this.attr('data-name') ? $this.data('name') : $this.text(),
                        mul = $this.data('mul'),
                        reload = $this.data('reload'),
                        p = window.parent.document,
                        $tabUl = $('.tabs-header ul', p),
                        $tabLi = $('.tabs-header li', p),
                        $tabBody = $('.tabs-body', p),
                        $tabPan = $('.tab-panel', p),
                        tab = $tabUl.find('li[data-name="' + name + '"]').data('tab');
                    $this.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    // 插入新標籤
                    function stellen() {
                        $tabLi.removeClass('active');
                        $tabUl.append('<li class="active" data-tab="' + link + '" data-name="' + name + '" data-num="' + tnum + '">' + name + '<i class="fa fa-close"></i></li>');
                        $tabPan.removeClass('active');
                        $tabBody.append('<div class="tab-panel active"><div class="right_col" role="main"><iframe src="' + link + '" data-iframe="' + link + '" data-num="' + tnum + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onLoad="$.iFrameHeight()" name="' + tnum + '"></iframe></div></div>');
                        tnum = tnum + 1;
                    }
                    if ($('.tabs-header li[data-name="' + name + '"]', p).length > 0 && typeof mul === 'undefined') {
                        if (!$('.tabs-header li[data-tab="' + link + '"]', p).length > 0) {
                            $tabUl.find('li[data-name="' + name + '"]').remove();
                            $tabBody.find('iframe[data-iframe="' + tab + '"]').remove();
                            stellen();
                        } else {
                            $tabLi.removeClass('active');
                            $tabUl.find('li[data-tab="' + link + '"]').addClass('active');
                            $tabPan.removeClass('active');
                            $tabBody.find('iframe[data-iframe="' + link + '"]').parent().parent().addClass('active');
                            if (reload === 'ja') {
                                $tabBody.find('iframe[data-iframe="' + link + '"]').attr('src', link);
                            }
                        }
                    } else {
                        stellen();
                    }
                });
                $(document).on('click', '.tabs-header li', function () { // 標籤欄切換
                    var $this = $(this),
                        link = $this.data('tab'),
                        cnum = $this.data('num'),
                        $tabUl = $('.tabs-header ul'),
                        $tabLi = $('.tabs-header li'),
                        $tabBody = $('.tabs-body'),
                        $tabPan = $('.tab-panel');
                    $tabLi.removeClass('active');
                    $tabUl.find('li[data-tab="' + link + '"][data-num="' + cnum + '"]').addClass('active');
                    $tabPan.removeClass('active');
                    $tabBody.find('iframe[data-iframe="' + link + '"][data-num="' + cnum + '"]').parent().parent().addClass('active');
                });
                $(document).on('click', '.tabs-header li .fa-close', function (e) { // 刪除標籤
                    var $this = $(this),
                        $li = $this.parent(),
                        tab = $li.data('tab'),
                        dnum = $li.data('num'),
                        $tabBody = $('.tabs-body'),
                        $prev = $li.prev();
                    $li.remove();
                    $tabBody.find('iframe[data-iframe="' + tab + '"][data-num="' + dnum + '"]').parent().parent().remove();
                    $prev.click();
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(document).on('mouseup touchend', '[data-source]', function () { // 點擊刷新tab
                    var $this = $(this),
                        source = $this.data('source'),
                        p = window.parent.document,
                        $tabBody = $('.tabs-body', p);
                    $tabBody.find('iframe[data-iframe="' + source + '"]').attr('src', source);
                    $.iFrameHeight();
                });
            }());
        },
        searchMore: function (ele, cont, option) {
            var newOption = option;
            ele.popover(newOption = $.extend(
                {
                    placement: 'left',
                    container: 'body',
                    html: true,
                    content: cont
                },
                newOption || {}
            ));
        },
        dateFormat: function (date) {
            var strYear,
                strMonth,
                strDate,
                strHour,
                strMinute,
                strSecond,
                dateFormat,
                str1,
                str2;
            str1 = '-';
            str2 = ':';
            strMonth = date.getMonth() + 1;
            console.log(strMonth);
            strDate = date.getDate() < 9 ? '0' + date.getDate() : date.getDate();
            console.log(strDate);
            strYear = date.getFullYear();
            console.log(strYear);
            strHour = date.getHours();
            console.log(strHour);
            strMinute = date.getMinutes();
            console.log(strMinute);
            strSecond = date.getSeconds();
            console.log(strSecond);
            dateFormat = strYear + str1 + strMonth + str1 + strDate + ' ' + strHour + str2 + strMinute + str2 + strSecond;
            return dateFormat;
        }
    };
}());
