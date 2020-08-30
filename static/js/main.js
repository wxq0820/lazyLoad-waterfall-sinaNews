$(function () {
    var waterfall = {
        init: function () {
            this.page = 1
            this.pageCount = 10
            this.colHeight = []
            this.isLoading = false
            this.itemWidth = $('.pic-ct').outerWidth(true)
            this.colCount = Math.floor($('.content').width() / this.itemWidth)
            for (var i = 0; i < this.colCount; i++) {
                this.colHeight[i] = 0
            }
            this.bind()
        },
        bind: function () {
            var that = this
            this.start()

            $(window).on('scroll',function(){
                // if(this.isLoading){
                //     clearTimeout(this.isLoading)
                // }
                // this.isLoading = setTimeout(function(){
                    if(!that.isLoading && that.toLoadNewData()){
                        that.start()
                    }
                // },100) 
            })
        },
        start: function(){
            var that = this
            this.isLoading = true
            this.getData(function(list){
                $.each(list.data,function(index, data){
                    var $node = that.creatNode(data)
                    $node.find('img').on('load',function(){
                        $('.content').append($node)
                        that.showImg($node)
                    })
                })
            })
            
            console.log('page: '+ this.page)
            this.page++
        },
        getData: function (callback) {
            var that = this
            $.ajax({
                url: 'https://photo.sina.cn/aj/v2/index?cate=military',
                method: 'GET',
                dataType: 'jsonp',
                jsonp: 'callback',
                data: {
                    page: this.page,
                    pagesize: this.pageCount
                }
            }).done(function (ret) {
                callback(ret)
                that.isLoading = false
            })
        },
        creatNode: function(data){
                var node = `<li class="pic-ct">
                        <a href="`+ data.ulr +`" class="link">
                            <img src="`+ data.thumb +`" alt="">
                            <h4 class="title">`+ data.stitle +`</h4>
                            <p class="detail">`+ data.title +`</p>
                        </a>
                    </li>`
                return $(node)
        },
        showImg: function ($node) {
            var minIndex = 0
            var minHeight = this.colHeight[0]
            for (var i = 0; i < this.colCount; i++) {
                if (minHeight > this.colHeight[i]) {
                    minHeight = this.colHeight[i]
                    minIndex = i
                }
            }
            $node.css({
                top: minHeight,
                left: minIndex * this.itemWidth
            })
            this.colHeight[minIndex] += $node.outerHeight(true)
            $('.content').height(Math.max.apply(null, this.colHeight))
        },
        toLoadNewData: function(){
            return ($(window).height() + $(window).scrollTop() +30) > $('.flag').offset().top      
        }
    }
    waterfall.init()
})