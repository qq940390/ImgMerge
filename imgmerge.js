(function(window, undefined) {
    var document = window.document,
        support = {
            transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
            touch: ("ontouchstart" in window)
        };

    function getPage(event, page) {
        return support.touch ? event.originalEvent.changedTouches[0][page] : event[page];
    }

    ImgMerge = {
        // 给初始化数据
        init: function(param) {
            var self = this;
            self.params = param || {};

            self.scale = 1;     //当前face的放大比例
            self.moreFinger = false; //触摸手指的状态 false：单手指 true：多手指
            self.distX = 0;
            self.distY = 0;
            self.newX = 0;
            self.newY = 0;
            self.canvasWidth = self.params.width;   //画板的宽度
            self.canvasHeight = self.params.height; //画板的高度
            self.handle = self.params.handle;   //css selector
            self.faceImg = new Image();
            self.maskImg = new Image();
            self.faceInitLeft = 0;
            self.faceInitTop = 0;
            self.maskInitLeft = 0;
            self.maskInitTop = 0;
            self.ctx = $(self.handle).get(0).getContext("2d");

            $(self.handle).prop('width', self.canvasWidth);
            $(self.handle).prop('height', self.canvasHeight);

            //绑定事件
            var myTouchStartFun = function(e) {
                self._touchstart(e);
            }
            self.touchStartFun = myTouchStartFun;

            var myTouchMoveFun = function(e) {
                self._touchmove(e);
            }
            self.touchMoveFun = myTouchMoveFun;

            var myTouchEndFun = function(e) {
                self._touchend(e);
            }
            self.touchEndFun = myTouchEndFun;

            var myTouchCancelFun = function(e) {
                self._touchcancel(e);
            }
            self.touchCancelFun = myTouchCancelFun;

            $(self.handle).on("touchstart", myTouchStartFun);
            $(self.handle).on("touchmove", myTouchMoveFun);
            $(self.handle).on("touchend", myTouchEndFun);
            $(self.handle).on("touchcancel", myTouchCancelFun);
        },
        loadFace: function(imgSrc, initLeft, initTop) {
            var self = this;

            self.faceInitLeft = typeof initLeft != 'undefined' ? initLeft : 0;
            self.faceInitTop = typeof initTop != 'undefined' ? initTop : 0;
            self.faceImg.src = imgSrc;
            self.faceImg.onload = function (){
                self.doDraw();
            };
        },
        loadMask: function(imgSrc, initLeft, initTop) {
            var self = this;

            self.maskInitLeft = typeof initLeft != 'undefined' ? initLeft : 0;
            self.maskInitTop = typeof initTop != 'undefined' ? initTop : 0;
            self.maskImg.src = imgSrc;
            self.maskImg.onload = function (){
                self.doDraw();
            };
        },
        doDraw: function() {
            var self = this;

            //清理画板
            self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

            //画脸
            self.ctx.drawImage(self.faceImg, self.faceInitLeft, self.faceInitTop);

            //画遮罩
            self.ctx.drawImage(self.maskImg, self.maskInitLeft, self.maskInitTop);

            //旋转控制旋钮
            self.ctx.beginPath();
            self.ctx.arc(self.faceInitLeft+(self.faceImg.width/2)-2, self.faceInitTop-5, 4, 0, Math.PI*2, false);
            self.ctx.closePath();
            self.ctx.lineWidth = 3;
            self.ctx.strokeStyle = "#0000ff";
            self.ctx.stroke();
        },
        _touchstart: function(e) {
            var self = this;
            var touchTarget = e.originalEvent.targetTouches.length; //获得触控点数

        },
        _touchmove: function(e) {
            var self = this;

        },
        _touchend: function(e) {
            var self = this;

        },
        _touchcancel: function(e) {
            var self = this;
        },
        //获取两点触控的位置和距离
        getTouchDist: function(e) {
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0,
                x3 = 0,
                y3 = 0,
                result = {};

            x1 = e.originalEvent.touches[0].pageX;
            x2 = e.originalEvent.touches[1].pageX;
            y1 = e.originalEvent.touches[0].pageY - document.body.scrollTop;
            y2 = e.originalEvent.touches[1].pageY - document.body.scrollTop;

            if (!x1 || !x2) return;

            if (x1 <= x2) {
                x3 = (x2 - x1) / 2 + x1;
            } else {
                x3 = (x1 - x2) / 2 + x2;
            }
            if (y1 <= y2) {
                y3 = (y2 - y1) / 2 + y1;
            } else {
                y3 = (y1 - y2) / 2 + y2;
            }

            result = {
                dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
                x: Math.round(x3),
                y: Math.round(y3)
            };
            return result;
        },
        eventStop: function(e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
            } catch(e) {}
        }
    };

    window.ImgMerge = ImgMerge;

})(this);