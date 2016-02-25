# LazyScroll for html
![Screenshot](https://github.com/zgc2537/zGenius/blob/master/sample-index1.png)
![Screenshot](https://github.com/zgc2537/zGenius/blob/master/sample-index2.png)
##Usage
    This project aims to provide a reusable scroll loading widget for html. It implements refreshing new view automatically when the former view scrolled to the given height from the end. I achieve it by simple method and less codes. It uses the html build-in scroll rather than custom scroll.
Here is the sample:
    var count = 0;
    //new lazyScroll object and init.
    var lazyScroll = new LazyScroll({
        outerid : 'outer-list',//Required. The id of the outer container whose height is equal to the visible region or less than it. 
        innerid : 'inner-list',//Requried. The id of the inner container which contains the main content.
        elementH : $("#goods-0").get(0).clientHeight,//Optional, elementH and slhfe are mutually exclusive, slhfe is defalut. The height of the one to be loaded.
        ehratio : 2,//Optional. This is working with the elementH. When Scrolling to elementH * ehratio high from the end of the former view, it will start loading the new content.
        slhfe : 0, //Optional.  When Scrolling to this given slhfe high from the end of the former view, it will start loading the new content.
        haveMore : true,//Optional, default is false. Whether or not there has more contents.
        loadingcb : getMoreGoods,//Required. The pointer of the function which loads the new contents.
        loadingtext : '正在加载...',//Optional.
        nomoretext : '没有更多了'//Optional.
    });

    function getMoreGoods() {
        setTimeout(function () {
            for (var i = 0; i < 20; i++) {
                $('.clearboth').before('<span id="goods-0" class="text-left goods-occupy goods-occupy-normal"><div            style="background-image:url(' + 'sample' + (count + 2) + '.png' + ')" class="goods-img img-auto"></div><p class="goods-description text-ellipsis">第' + (count + 1) + '次加载图片</p><p class="goods-price">￥100</p></span>');
            }
            if (count < 1) {
                //loadEnd(haveMore)
                lazyScroll.loadEnd(true);//when new contents were loaded, notice changing.
            } else {
                lazyScroll.loadEnd(false);
            }
            count++;
        }, 5000);
    }
