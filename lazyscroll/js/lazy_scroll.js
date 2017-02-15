/*!
 * LazyScroll v1.0.0 ~ Copyright (c) 2016 Guocheng Zhou
 */
!function (a, b, c) {
    var lazyScroll = function (options) {
        this.opts = $.extend({
                outerCId : '', //内容容器的外部容器id，一般高度小于等于屏幕高度的容器
                innerCId : '', //内容容器id，装载内容的直接容器
                loadingAId: undefined,//加载条所在的容器Id,默认放在inner容器底部
                hElement : undefined, //动态加载代表行高的单个内容项Id，与slhfe互斥，两个参数选其一进行复制，
                                      //如果两个参数都有，则以此参数为准
                hERatio : 2, //hElement，从内容容器底部开始向上hElement.clientHeight * ehratio的高度处开始加载新的内容
                slhfe : 400, //从内容容器底部开始向上的高度，从此高度就开始加载新的内容
                haveMoreData : false, //是否还有更多的内容
                loadingCb : null, //用户自定义加载数据动作，由控件自动调用
                haveInitData : true, //是否有初始数据
                loadingText : '正在加载...',
                noMoreText : '没有更多了'
            }, options || {}),
        this.loading = false,
        this.tipObj = null,
        this.tipLabelObj = null,
        this.tipHtmlStr = '<div id="ls_sts_bar" class = "split_loading"><span class="ls-loading">\
			<div class="ls-loading-container container1"><div class="ls-loading-container container2">\
			<div class="circle1"></div><div class="circle2"></div><div class="circle3"></div>\
			<div class="circle4"></div></div><div class="ls-loading-container container3">\
			<div class="circle1"></div><div class="circle2"></div><div class="circle3"></div>\
			<div class="circle4"></div></div></span><span class="sts_label">'
                + this.opts.loadingText + '</span></div>',
        this.outerVistibleHeight = $('#' + this.opts.outerCId).get(0).clientHeight,
        this.initGetData = true;
        this._calElementHeight();
        this._init();
    };
    lazyScroll.prototype = {
        _init : function () {
            if(!this.opts.haveInitData) {
                this.loading = true;
                this.opts.loadingCb();
            }
            this._insertFooterUI();
            if (this.opts.haveInitData && !this.opts.haveMoreData) {
                this._changeToNoMoreUi();
                this._unbindScrollEvent();
            } else {
                this._bindScrollEvent();
            }
        },
        _calElementHeight : function() {
			this.elementH = $("#" + this.opts.hElement).clientHeight;
        },
        _scrollHandler : function () {
            var scrollT = $(window).scrollTop(),
            loadingHeightFromBottom = this.lazyScroll.elementH ? this.lazyScroll.elementH * this.lazyScroll.opts.hERatio :
				this.lazyScroll.opts.slhfe;

            if ($('#' + this.lazyScroll.opts.innerCId).get(0).clientHeight - this.lazyScroll.outerVistibleHeight -
					loadingHeightFromBottom < scrollT && !this.lazyScroll.loading) {
                this.lazyScroll.loading = true;
                this.lazyScroll.opts.loadingCb();
            }
        },
        /** 内容加载完成后，由外部调用此方法
         * more : 内容加载完成后，是否还有更多的内容
         **/
        loadEnd : function (more) {
            if(!this.opts.haveInitData && this.initGetData) {
                this._calElementHeight();
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
        removeFooterUI: function () {
            this.tipObj.remove();
        },
        _insertFooterUI : function () {
            if(this.opts.loadingAId) {
                $('#' + this.opts.loadingAId).append(this.tipHtmlStr);
            } else {
                $('#' + this.opts.innerCId).append(this.tipHtmlStr);
            }
            this.tipObj = $('#ls_sts_bar');
            this.tipLabelObj = $('.sts_label');
        },
        _changeToNoMoreUi : function () {
            this.tipObj.removeClass("split_loading");
            this.tipObj.addClass("nomore");
            this.tipLabelObj.text(this.opts.noMoreText);
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
