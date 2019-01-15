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
var PlayInfo = (function (_super) {
    __extends(PlayInfo, _super);
    function PlayInfo() {
        return _super.call(this) || this;
    }
    PlayInfo.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    PlayInfo.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.backShp = new egret.Shape();
        this.backShp.graphics.beginFill(0x000000, 0.2);
        this.backShp.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
        this.backShp.graphics.endFill();
        this.backShp.touchEnabled = true;
        this.addChild(this.backShp);
        this.backShp.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameConst.removeChild(_this);
        }, this);
        this.init();
    };
    PlayInfo.prototype.init = function () {
        var pheight = this.imgPoint.height;
        var twPoint = egret.Tween.get(this.imgPoint, { loop: true });
        twPoint.to({ rotation: 25, height: pheight + 25 }, 800).to({ rotation: 0, height: pheight }, 800).to({ rotation: -25, height: pheight + 25 }, 800).to({ rotation: 0, height: pheight }, 800);
        var twHand = egret.Tween.get(this.imgHand, { loop: true });
        twHand.to({ x: GameConst.StageW * 50 / 640 + this.imgHand.width / 2 }, 800).to({ x: GameConst.StageW * 1 / 2 }, 800).to({ x: GameConst.StageW * 592 / 640 - this.imgHand.width / 2 }, 800).to({ x: GameConst.StageW * 1 / 2 }, 800);
    };
    return PlayInfo;
}(eui.Component));
__reflect(PlayInfo.prototype, "PlayInfo", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=PlayInfo.js.map