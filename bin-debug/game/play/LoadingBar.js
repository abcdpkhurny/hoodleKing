var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoadingBar = (function (_super) {
    __extends(LoadingBar, _super);
    function LoadingBar(_bg, _bar) {
        var _this = _super.call(this) || this;
        /**
         * 反向进度条
         * */
        _this.reverse = false;
        // 当被添加到舞台的时候触发 (被添加到舞台,说明资源组已经加载完成)
        _this._bg = _bg;
        _this._bar = _bar;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.createView, _this);
        return _this;
    }
    LoadingBar.prototype.createView = function () {
        var _this = this;
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
        this.bg = GameConst.CreateBitmapByName("main_bg_jpg");
        this.addChild(this.bg);
        this.bglogo = GameConst.CreateBitmapByName("icon_logo_png");
        this.addChild(this.bglogo);
        this.bglogo.x = this.width / 2 - this.bglogo.width / 2;
        this.bglogo.y = 94;
        //帧动画
        var data = RES.getRes("tmplate_json");
        var txtr = RES.getRes("tmplate_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        this.mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("plate"));
        this.addChild(this.mc1);
        this.mc1.gotoAndPlay(1, -1);
        //进度条
        this.background = new egret.Bitmap(RES.getRes(this._bg));
        this.bar = new egret.Bitmap(RES.getRes(this._bar));
        this.addChild(this.background);
        this.addChild(this.bar);
        this.background.x = this.width / 2 - this.background.width / 2;
        this.background.y = this.height * 3 / 5;
        this.bar.x = (this.background.width - this.bar.width) / 2 + this.background.x;
        this.bar.y = (this.background.height - this.bar.height) / 2 + this.background.y;
        this.barMask = new egret.Rectangle(0, 0, 0, this.bar.height);
        this.bar.mask = this.barMask;
        this.mc1.x = this.width / 2 - this.background.width / 2;
        this.mc1.y = this.height * 3 / 5 - this.mc1.height + 8;
        //这里动态加载文字
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.width = 480;
        this.textField.height = 40;
        this.textField.x = this.width / 2 - this.textField.width / 2;
        this.textField.y = this.background.y + 100;
        this.textField.size = 30;
        this.textField.textAlign = "center";
        this.textField.text = '正努力加载中';
        var t = 1;
        this.timeText = window.setInterval(function () {
            var tt = '正努力加载中';
            for (var i = 0; i < t; i++) {
                tt = tt + ".";
            }
            t++;
            if (t > 3)
                t = 1;
            _this.textField.text = tt;
        }, 600);
        //从舞台删除时执行
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.clearTime, this);
    };
    LoadingBar.prototype.clearTime = function () {
        window.clearInterval(this.timeText);
        GameConst.removeChild(this.textField);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.clearTime, this);
    };
    // 这个函数在加载中会自动调用
    LoadingBar.prototype.onProgress = function (current, total) {
        var per = Math.floor((current / total) * 100) / 100;
        this.barMask = new egret.Rectangle(0, 0, (this.reverse ? (1 - per) : per) * this.bar.width, this.bar.height);
        this.bar.mask = this.barMask;
        //对比百分百车子行走
        var startper = this.mc1.width / this.bar.width;
        if (per > startper)
            this.mc1.x = this.width / 2 - this.background.width / 2 + (per - startper) * this.bar.width;
    };
    return LoadingBar;
}(egret.Sprite));
__reflect(LoadingBar.prototype, "LoadingBar", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingBar.js.map