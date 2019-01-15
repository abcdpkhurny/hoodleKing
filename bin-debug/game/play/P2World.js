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
var P2World = (function (_super) {
    __extends(P2World, _super);
    function P2World(stageW, stageH) {
        var _this = _super.call(this) || this;
        _this.timeOnEnterFrame = 0;
        _this.factor = 30;
        _this.bgStageW = stageW;
        _this.bgStageH = stageH;
        return _this;
    }
    Object.defineProperty(P2World.prototype, "p2World", {
        get: function () {
            return this.world;
        },
        enumerable: true,
        configurable: true
    });
    //初始化
    P2World.prototype.init = function () {
        this.CreateWorld();
        this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
        this.timeOnEnterFrame = egret.getTimer();
    };
    P2World.prototype.createConfine = function () {
        //右
        var linenum = 810;
        var lineShape = new p2.Line({ length: linenum });
        //可以为任何形状
        var wallBady = new p2.Body({
            //type: p2.Body.KINEMATIC,
            position: [GameConst.StageW * 592 / 640, 568]
        });
        wallBady.addShape(lineShape);
        this.world.addBody(wallBady);
        wallBady.angle = Math.PI / 2;
        this.display = this.displayLine("icon_line_png", linenum);
        this.display.rotation = 90;
        wallBady.shapes[0].collisionMask = 6;
        wallBady.displays = [this.display];
        wallBady.damping = 0;
        wallBady.fixedX = true;
        wallBady.fixedY = true;
        this.addChild(this.display);
        //左
        var lineShape1 = new p2.Line({ length: linenum });
        //可以为任何形状
        var wallBady1 = new p2.Body({
            //type: p2.Body.KINEMATIC,
            position: [GameConst.StageW * 49 / 640, 568]
        });
        wallBady1.addShape(lineShape1);
        this.world.addBody(wallBady1);
        wallBady1.angle = Math.PI / 2;
        this.display = this.displayLine("icon_line_png", linenum);
        this.display.rotation = 90;
        wallBady1.shapes[0].collisionMask = 6;
        wallBady1.displays = [this.display];
        wallBady1.damping = 0;
        wallBady1.fixedX = true;
        wallBady1.fixedY = true;
        this.addChild(this.display);
        //上
        var shangnum = 560;
        var lineShape2 = new p2.Line({ length: shangnum });
        //可以为任何形状
        var wallBady2 = new p2.Body({
            //type: p2.Body.KINEMATIC,
            position: [GameConst.StageW / 2, 185]
        });
        wallBady2.addShape(lineShape2);
        this.world.addBody(wallBady2);
        this.display = this.displayLine("icon_line_png", shangnum);
        wallBady2.shapes[0].collisionMask = 6;
        wallBady2.displays = [this.display];
        wallBady2.damping = 0;
        wallBady2.fixedX = true;
        wallBady2.fixedY = true;
        this.addChild(this.display);
        var bodys = [];
        bodys.push(wallBady);
        bodys.push(wallBady1);
        bodys.push(wallBady2);
        return bodys;
    };
    P2World.prototype.createPedestal = function () {
        //下面左底
        var vertices = [
            [151, -83],
            [151, 83],
            [-151, 83],
            [-151, -26]
        ];
        var leftshape = new p2.Convex({ vertices: vertices });
        //可以为任何形状
        this.leftPlane = new p2.Body({
            type: p2.Body.STATIC,
            position: [0 + 151, this.bgStageH - 83]
        });
        this.display = GameConst.CreateBitmapByName("play_bg1_png");
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        this.display.x = 0 + 151;
        this.display.y = this.bgStageH - 166 - 83;
        this.leftPlane.addShape(leftshape);
        this.world.addBody(this.leftPlane);
        this.leftPlane.shapes[0].collisionMask = 6;
        this.leftPlane.displays = [this.display];
        this.leftPlane.fixedX = true;
        this.leftPlane.fixedY = true;
        this.leftPlane.damping = 0;
        this.addChild(this.display);
        //下面右底
        var vertices1 = [
            [151, -26],
            [151, 83],
            [-151, 83],
            [-151, -83]
        ];
        var rightshape = new p2.Convex({ vertices: vertices1 });
        //可以为任何形状
        this.rightPlane = new p2.Body({
            type: p2.Body.STATIC,
            position: [GameConst.StageW - 151, this.bgStageH - 83]
        });
        this.display = GameConst.CreateBitmapByName("play_bg2_png");
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        this.display.x = GameConst.StageW - 151;
        this.display.y = this.bgStageH - 166 - 83;
        this.rightPlane.addShape(rightshape);
        this.world.addBody(this.rightPlane);
        this.rightPlane.shapes[0].collisionMask = 6;
        this.rightPlane.displays = [this.display];
        this.rightPlane.fixedX = true;
        this.rightPlane.fixedY = true;
        this.rightPlane.damping = 0;
        this.addChild(this.display);
        var bodys = [];
        bodys.push(this.leftPlane);
        bodys.push(this.rightPlane);
        return bodys;
    };
    P2World.prototype.CreateWorld = function () {
        this.world = new p2.World();
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.gravity = [0, 0];
    };
    /**创建四面墙刚体*/
    P2World.prototype.createWall = function () {
        var bodys = [];
        bodys.push(this.createPlane(0, 0, 0)); //上
        bodys.push(this.createPlane(-Math.PI / 2, 0, 0)); //左
        bodys.push(this.createPlane(Math.PI, 0, this.bgStageH)); //下
        bodys.push(this.createPlane(Math.PI / 2, this.bgStageW, 0)); //右
        return bodys;
    };
    /**创建平面刚体*/
    P2World.prototype.createPlane = function (angle, x, y) {
        if (angle === void 0) { angle = Math.PI; }
        var shape = new p2.Plane();
        var body = this.getBody(0, p2.Body.STATIC);
        body.addShape(shape);
        body.shapes[0].collisionMask = 6;
        body.angle = angle;
        body.position[0] = x;
        body.position[1] = y;
        this.world.addBody(body);
        return body;
    };
    /**创建刚体 */
    P2World.prototype.getBody = function (mass, type) {
        if (mass === void 0) { mass = 0; }
        if (type === void 0) { type = p2.Body.DYNAMIC; }
        var body = new p2.Body({ mass: mass });
        body.type = type;
        body.displays = [];
        return body;
    };
    //帧事件，步函数
    P2World.prototype.update = function () {
        var now = egret.getTimer();
        var pass = now - this.timeOnEnterFrame;
        var dt = 1000 / pass;
        this.timeOnEnterFrame = egret.getTimer();
        this.world.step(1 / 60, dt / 1000, 10);
        var l = this.world.bodies.length;
        for (var i = 0; i < l; i++) {
            var boxBody = this.world.bodies[i];
            var box = boxBody.displays[0];
            if (box) {
                box.x = boxBody.position[0];
                box.y = boxBody.position[1];
            }
        }
        if (this.loopBackFun != null) {
            this.loopBackFun();
        }
    };
    /**创建圆形刚体与圆形形状 */
    P2World.prototype.createCircleBodyShape = function (radius, type) {
        if (type === void 0) { type = p2.Body.DYNAMIC; }
        var body = this.getBody(10, type);
        var shape = new p2.Circle({ radius: radius });
        body.addShape(shape);
        this.world.addBody(body);
        return body;
    };
    /**
     * 创建方形刚体与形状
     * angle=rotation*Math.PI/180
     */
    P2World.prototype.createBoxBodyShape = function (width, height, type, angle) {
        if (type === void 0) { type = p2.Body.DYNAMIC; }
        if (angle === void 0) { angle = 0; }
        var body = this.getBody(10, type);
        var shape = new p2.Box({ width: width, height: height });
        body.addShape(shape);
        body.angle = angle;
        this.world.addBody(body);
        return body;
    };
    /**创建多边形刚体与形状(值得注意的是锚点要在中间，这样就不能从[0,0]开始) */
    P2World.prototype.createConvexBodyShape = function (points, type) {
        if (type === void 0) { type = p2.Body.DYNAMIC; }
        var body = this.getBody(10, type);
        body.fromPolygon(points, { optimalDecomp: false });
        this.world.addBody(body);
        return body;
    };
    /**创建正多边形,side边数，radius为半径*/
    P2World.prototype.createPolygon = function (side, radius, type) {
        if (side === void 0) { side = 3; }
        if (radius === void 0) { radius = 30; }
        if (type === void 0) { type = p2.Body.DYNAMIC; }
        var body = this.getBody(10, type);
        var points = [];
        for (var i = 0; i < side; i++) {
            var x = Math.cos((i * (360 / side) * Math.PI / 180)) * radius;
            var y = Math.sin((i * (360 / side) * Math.PI / 180)) * radius;
            points.push([x, y]);
        }
        return this.createConvexBodyShape(points, type);
    };
    //显示圆形
    P2World.prototype.displayCircle = function (bitmap, circleShape) {
        var tu = GameConst.CreateBitmapByName(bitmap);
        tu.width = circleShape.radius * 2;
        tu.height = circleShape.radius * 2;
        tu.anchorOffsetX = tu.width / 2;
        tu.anchorOffsetY = tu.height / 2;
        tu.x = -500;
        return tu;
    };
    //显示正方形
    P2World.prototype.displayBox = function (bitmap, boxShape, x, y, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var tu = GameConst.CreateBitmapByName(bitmap);
        tu.width = boxShape.width;
        tu.height = boxShape.height;
        tu.rotation = rotation;
        tu.anchorOffsetX = tu.width / 2;
        tu.anchorOffsetY = tu.height / 2;
        tu.x = -500;
        return tu;
    };
    //显示多边形
    P2World.prototype.displayConvex = function (bitmap, width, height, x, y, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var tu = GameConst.CreateBitmapByName(bitmap);
        tu.width = width;
        tu.height = height;
        tu.rotation = rotation;
        tu.anchorOffsetX = tu.width / 2;
        tu.anchorOffsetY = tu.height / 2;
        tu.x = -500;
        return tu;
    };
    //显示直线
    P2World.prototype.displayLine = function (bitmap, linenum) {
        var tu = GameConst.CreateBitmapByName(bitmap);
        tu.width = linenum;
        tu.height = 1;
        tu.anchorOffsetX = tu.width / 2;
        tu.anchorOffsetY = tu.height / 2;
        return tu;
    };
    return P2World;
}(egret.DisplayObjectContainer));
__reflect(P2World.prototype, "P2World");
//# sourceMappingURL=P2World.js.map