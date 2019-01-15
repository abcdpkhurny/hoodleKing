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
var Barrier = (function (_super) {
    __extends(Barrier, _super);
    function Barrier(stageW, stageH) {
        var _this = _super.call(this) || this;
        _this.stageW = stageW;
        _this.stageH = stageH;
        return _this;
    }
    Barrier.prototype.init = function () {
    };
    Barrier.prototype.updateBarrier = function (scores, ballSum, round) {
        console.log("scores:" + scores + ",ballSum:" + ballSum + ",round:" + round);
        var bodys = [];
        var world = this.world;
        var body;
        var shape;
        //x的范围估算
        for (var i = 0; i < 5; i++) {
            var random = Math.floor(Math.random() * 10);
            var slope = Math.floor(Math.random() * 180);
            var angle = slope * Math.PI / 180;
            var randomX = Math.floor(Math.random() * 10);
            var randomY = Math.floor(Math.random() * 10);
            var position = [115 + i * 100 + randomX, 845 + randomY];
            var ballnum;
            if (scores > 10000) {
                ballnum = Math.ceil(Math.random() * (ballSum + scores / 30)) + Math.floor(Math.random() * ballSum) + Math.ceil(scores / 200);
            }
            else if (scores > 5000) {
                ballnum = Math.ceil(Math.random() * (ballSum + scores / 30)) + Math.floor(Math.random() * ballSum) + Math.ceil(scores / 100);
            }
            else if (scores > 1000) {
                ballnum = Math.ceil(Math.random() * (ballSum + scores / 30)) + Math.floor(Math.random() * ballSum) + Math.ceil(scores / 50);
            }
            else if (scores > 100) {
                ballnum = Math.ceil(Math.random() * (ballSum + scores / 30)) + Math.floor(Math.random() * ballSum) + Math.ceil(scores / 40);
            }
            else if (scores > 30) {
                ballnum = Math.ceil(Math.random() * (ballSum + scores / 30)) + Math.floor(Math.random() * ballSum) + Math.ceil(scores / 30);
            }
            else {
                ballnum = Math.ceil(Math.random() * ballSum) + Math.floor(Math.random() * (ballSum / 2));
            }
            var addl = 0;
            if (ballSum < 2)
                addl = 0.5;
            else if (ballSum < 4)
                addl = 1;
            else if (ballSum < 6)
                addl = 1.5;
            else if (ballSum < 8)
                addl = 2;
            else
                addl = 2.5;
            //这里概率生成障碍物
            if (random >= 7) {
                //圆
                body = world.createCircleBodyShape(25, p2.Body.STATIC);
                body.position = [position[0], position[1]];
                shape = world.displayCircle("icon_roundness_png", body.shapes[0]);
                body.displays[0] = shape;
                body.damping = 0;
                this.addChild(shape);
                var skin = new NumImage();
                skin.createText(position[0], position[1], "1", this, shape.width, shape.height);
                skin.value = ballnum;
                body["hit"] = true;
                body["num"] = true;
                body["skin"] = skin;
                bodys.push(body);
            }
            else if (random >= 5) {
                //正方体
                body = world.createBoxBodyShape(50, 50, p2.Body.STATIC, angle);
                body.position = position;
                shape = world.displayBox("icon_square_png", (body.shapes[0]), position[0], position[1], slope);
                body.displays[0] = shape;
                body.damping = 0;
                this.addChild(shape);
                var skin = new NumImage();
                skin.createText(position[0], position[1], "1", this, shape.width, shape.height);
                skin.value = ballnum;
                body["hit"] = true;
                body["num"] = true;
                body["skin"] = skin;
                bodys.push(body);
            }
            else if (random >= 3) {
                //正三角体
                var radius = 40;
                body = world.createPolygon(3, radius, p2.Body.STATIC);
                body.position = position;
                body.shapes[0].angle = angle;
                var convexW = radius * Math.cos(radius * Math.PI / 180) + radius;
                var convexH = Math.sqrt(radius + radius - (radius - convexW) * (radius - convexW)) * 2;
                shape = world.displayConvex("icon_trilateral_png", convexW, convexH, position[0], position[1], 90 + slope);
                body.displays[0] = shape;
                body.damping = 0;
                this.addChild(shape);
                var skin = new NumImage();
                //skin.createText(position[0], position[1], "1", this, shape.width, shape.height, 90 + slope)
                skin.createText(position[0], position[1], "1", this, shape.width, shape.height);
                skin.value = ballnum;
                body["hit"] = true;
                body["num"] = true;
                body["skin"] = skin;
                //console.log(body)
                bodys.push(body);
            }
            else if (random >= addl) {
                var r = Math.floor(Math.random() * 10);
                var flay = false;
                if (ballSum < 2)
                    flay = true;
                else if (ballSum < 4 && r < 5)
                    flay = true;
                else if (ballSum < 6 && r < 4)
                    flay = true;
                else if (ballSum < 8 && r < 2)
                    flay = true;
                else if (ballSum < 100 && r < 1)
                    flay = true;
                if (!flay)
                    continue;
                //添加球
                body = world.createCircleBodyShape(20, p2.Body.STATIC);
                body.position = [position[0], position[1]];
                shape = world.displayCircle("play_ball_png", body.shapes[0]);
                body.displays[0] = shape;
                body.damping = 0;
                this.addChild(shape);
                body["hit"] = true;
                body["num"] = false;
                bodys.push(body);
            }
        }
        return bodys;
    };
    return Barrier;
}(eui.Component));
__reflect(Barrier.prototype, "Barrier");
//# sourceMappingURL=Barrier.js.map