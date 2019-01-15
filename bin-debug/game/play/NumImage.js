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
var NumImage = (function (_super) {
    __extends(NumImage, _super);
    function NumImage() {
        var _this = _super.call(this) || this;
        _this._value = -1;
        return _this;
    }
    // public initNum(v: number): void {
    // 	this.txt = this.createText(0, 0);
    // 	this.value = v;
    // 	this.txt.text = String(v);
    // }
    NumImage.prototype.createText = function (x, y, s, that, width, height, rotation, c, f) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (s === void 0) { s = ""; }
        if (width === void 0) { width = 30; }
        if (height === void 0) { height = 30; }
        if (rotation === void 0) { rotation = 0; }
        if (c === void 0) { c = 0XFFFFFF; }
        if (f === void 0) { f = "黑体"; }
        this.txt = new egret.TextField();
        var text = this.txt;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.text = s;
        text.textColor = c;
        text.fontFamily = f;
        text.width = width;
        text.height = height;
        text.anchorOffsetX = width >> 1;
        text.anchorOffsetY = height >> 1;
        text.rotation = rotation;
        text.x = x;
        text.y = y;
        that.addChild(text);
        return text;
    };
    Object.defineProperty(NumImage.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            this.txt.text = String(v);
            //this.txt.textColor = 0;
        },
        enumerable: true,
        configurable: true
    });
    NumImage.prototype.update = function () {
        this._value--;
        this.txt.text = String(this._value);
        //this.value = this._value;
        //console.log(this.value)
    };
    return NumImage;
}(egret.DisplayObjectContainer));
__reflect(NumImage.prototype, "NumImage");
//# sourceMappingURL=NumImage.js.map