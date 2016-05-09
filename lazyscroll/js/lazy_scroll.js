/*!
 * LazyScroll v1.0.0 ~ Copyright (c) 2016 Guocheng Zhou
 */
!function (a, b, c) {
    var lazyScroll = function (options) {
        this.opts = $.extend({
                outerid : '', //内容容器的外部容器id，一般高度小于等于屏幕高度的容器
                innerid : '', //内容容器id，装载内容的直接容器
                hElement : undefined, //动态加载单个内容项，与slhfe互斥，两个参数选其一进行复制，
                                      //如果两个参数都有，则以此参数的clientHeight为准
                ehratio : 2, //与hElement配合使用，从内容容器底部开始向上hElement.clientHeight * ehratio的高度处开始加载新的内容
                slhfe : 100, //从内容容器底部开始向上的高度，从此高度就开始加载新的内容
                haveMore : false, //是否还有更多的内容
                haveInitData : true, //是否有初始数据
                loadingcb : null, //用户自定义加载数据动作，由控件自动调用
                loadingtext : '正在加载...',
                nomoretext : '没有更多了'
            }, options || {}),
        this.elementH = this.opts.hElement ? this.opts.hElement.clientHeight : 0,
        this.loading = false,
        this.tipObj = null,
        this.tipLabelObj = null,
        this.tipHtmlStr = '<div id="ls_sts_bar" class = "split_loading"><span class="ls-loading">\
        <div class="ls-loading-container container1"><div class="circle1"></div><div class="circle2"></div>\
        <div class="circle3"></div><div class="circle4"></div></div><div class="ls-loading-container container2">\
        <div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div>\
        </div><div class="ls-loading-container container3"><div class="circle1"></div><div class="circle2"></div>\
        <div class="circle3"></div><div class="circle4"></div></div></span><span class="sts_label">'
        + this.opts.loadingtext + '</span></div>',
        this.outerVistibleHeight = $('#' + this.opts.outerid).get(0).clientHeight,
        this.initGetData = true;
        this._init();
    };
    lazyScroll.prototype = {
        _init : function () {
            if(!this.opts.haveInitData) {
                this.loading = true;
                this.opts.loadingcb();
            }
            this._insertFooterUI();
            if (this.opts.haveMore) {
                this._bindScrollEvent();
            } else {
                this._changeToNoMoreUi();
                this._unbindScrollEvent();
            }
        },
        _scrollHandler : function () {
            var scrollT = $(window).scrollTop(),
            loadingHeightFromBottom = this.lazyScroll.elementH ? this.lazyScroll.elementH * this.lazyScroll.opts.ehratio :
                this.lazyScroll.opts.slhfe;

            if ($('#' + this.lazyScroll.opts.innerid).get(0).clientHeight - this.lazyScroll.outerVistibleHeight -
                loadingHeightFromBottom < scrollT && !this.lazyScroll.loading) {
                this.lazyScroll.loading = true;
                this.lazyScroll.opts.loadingcb();
            }
        },
        /** 内容加载完成后，由外部调用此方法
         * more : 内容加载完成后，是否还有更多的内容
         **/
        loadEnd : function (more) {
            if(!this.opts.haveInitData && this.initGetData) {
                this.elementH = this.opts.hElement ? this.opts.hElement.clientHeight : 0;
                this.initGetData = false;
                this.tipObj.remove();
                this._insertFooterUI();
            }
            if (!more) {
                this._changeToNoMoreUi();
                this._unbindScrollEvent();
            }
            this.loading = false;
        },
        _insertFooterUI : function () {
            $('#' + this.opts.innerid).append(this.tipHtmlStr);
            this.tipObj = $('#ls_sts_bar');
            this.tipLabelObj = $('.sts_label');
        },
        _changeToNoMoreUi : function () {
            this.tipObj.removeClass("split_loading");
            this.tipObj.addClass("nomore");
            this.tipLabelObj.text(this.opts.nomoretext);
        },
        _bindScrollEvent : function () {
            $(window).scroll(this._scrollHandler);
        },
        _unbindScrollEvent : function () {
            $(window).off("scroll", this._scrollHandler);
        }
    };

    if (typeof exports !== 'undefined') {
        exports[c] = lazyScroll;
    } else {
        a[c] = lazyScroll;
    }
}
(window, document, "LazyScroll");
