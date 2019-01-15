class P2World extends egret.DisplayObjectContainer {
	world: p2.World;
	bgStageW: number;
	bgStageH: number;

	public constructor(stageW: number, stageH: number) {
		super();
		this.bgStageW = stageW
		this.bgStageH = stageH
	}
	public get p2World(): p2.World {
		return this.world;
	}

	public timeOnEnterFrame: number = 0
	private factor: number = 30;

	/**贴图 */
	private display: egret.DisplayObject;

	//初始化
	public init() {
		this.CreateWorld();
		this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		this.timeOnEnterFrame = egret.getTimer();
	}



	private leftPlane: p2.Body
	private rightPlane: p2.Body

	public createConfine(): any[] {
		//右
		var linenum = 810
		var lineShape: p2.Line = new p2.Line({ length: linenum });
		//可以为任何形状
		var wallBady = new p2.Body({
			//type: p2.Body.KINEMATIC,
			position: [GameConst.StageW * 592 / 640, 568]
		});
		wallBady.addShape(lineShape);
		this.world.addBody(wallBady);
		wallBady.angle = Math.PI / 2;
		this.display = this.displayLine("icon_line_png", linenum)
		this.display.rotation = 90;
		wallBady.shapes[0].collisionMask = 6

		wallBady.displays = [this.display];
		wallBady.damping = 0;
		wallBady.fixedX = true;
		wallBady.fixedY = true;

		this.addChild(this.display);

		//左
		var lineShape1: p2.Line = new p2.Line({ length: linenum });
		//可以为任何形状
		var wallBady1 = new p2.Body({
			//type: p2.Body.KINEMATIC,
			position: [GameConst.StageW * 49 / 640, 568]
		});
		wallBady1.addShape(lineShape1);
		this.world.addBody(wallBady1);
		wallBady1.angle = Math.PI / 2;

		this.display = this.displayLine("icon_line_png", linenum)
		this.display.rotation = 90;
		wallBady1.shapes[0].collisionMask = 6

		wallBady1.displays = [this.display];
		wallBady1.damping = 0;
		wallBady1.fixedX = true;
		wallBady1.fixedY = true;

		this.addChild(this.display);

		//上
		var shangnum = 560
		var lineShape2: p2.Line = new p2.Line({ length: shangnum });
		//可以为任何形状
		var wallBady2 = new p2.Body({
			//type: p2.Body.KINEMATIC,
			position: [GameConst.StageW / 2, 185]
		});
		wallBady2.addShape(lineShape2);
		this.world.addBody(wallBady2);

		this.display = this.displayLine("icon_line_png", shangnum)
		wallBady2.shapes[0].collisionMask = 6

		wallBady2.displays = [this.display];
		wallBady2.damping = 0;
		wallBady2.fixedX = true;
		wallBady2.fixedY = true;

		this.addChild(this.display);

		var bodys: any[] = []
		bodys.push(wallBady)
		bodys.push(wallBady1)
		bodys.push(wallBady2)
		return bodys;
	}

	public createPedestal(): any[] {
		//下面左底
		var vertices: number[][] =
			[
				[151, -83],
				[151, 83],
				[-151, 83],
				[-151, -26]
			];
		var leftshape: p2.Convex = new p2.Convex({ vertices: vertices })
		//可以为任何形状
		this.leftPlane = new p2.Body({
			type: p2.Body.STATIC,
			position: [0 + 151, this.bgStageH - 83]
		});
		this.display = GameConst.CreateBitmapByName("play_bg1_png");
		this.display.anchorOffsetX = this.display.width / 2
		this.display.anchorOffsetY = this.display.height / 2;
		this.display.x = 0 + 151
		this.display.y = this.bgStageH - 166 - 83

		this.leftPlane.addShape(leftshape);
		this.world.addBody(this.leftPlane);

		this.leftPlane.shapes[0].collisionMask = 6
		this.leftPlane.displays = [this.display];
		this.leftPlane.fixedX = true;
		this.leftPlane.fixedY = true;
		this.leftPlane.damping = 0;
		this.addChild(this.display);

		//下面右底
		var vertices1: number[][] =
			[
				[151, -26],
				[151, 83],
				[-151, 83],
				[-151, -83]
			];
		var rightshape: p2.Convex = new p2.Convex({ vertices: vertices1 })
		//可以为任何形状
		this.rightPlane = new p2.Body({
			type: p2.Body.STATIC,
			position: [GameConst.StageW - 151, this.bgStageH - 83]
		});
		this.display = GameConst.CreateBitmapByName("play_bg2_png");
		this.display.anchorOffsetX = this.display.width / 2
		this.display.anchorOffsetY = this.display.height / 2;
		this.display.x = GameConst.StageW - 151
		this.display.y = this.bgStageH - 166 - 83

		this.rightPlane.addShape(rightshape);
		this.world.addBody(this.rightPlane);

		this.rightPlane.shapes[0].collisionMask = 6
		this.rightPlane.displays = [this.display];
		this.rightPlane.fixedX = true;
		this.rightPlane.fixedY = true;
		this.rightPlane.damping = 0
		this.addChild(this.display);

		var bodys: any[] = []
		bodys.push(this.leftPlane)
		bodys.push(this.rightPlane)
		return bodys;
	}


	private CreateWorld() {
		this.world = new p2.World();
		this.world.sleepMode = p2.World.BODY_SLEEPING;
		this.world.gravity = [0, 0]
	}

	/**创建四面墙刚体*/
	public createWall(): Array<p2.Plane> {
		var bodys: any[] = []
		bodys.push(this.createPlane(0, 0, 0));//上
		bodys.push(this.createPlane(-Math.PI / 2, 0, 0));//左
		bodys.push(this.createPlane(Math.PI, 0, this.bgStageH));//下
		bodys.push(this.createPlane(Math.PI / 2, this.bgStageW, 0));//右
		return bodys;
	}

	/**创建平面刚体*/
	public createPlane(angle: number = Math.PI, x: number, y: number): p2.Body {
		var shape = new p2.Plane();
		var body = this.getBody(0, p2.Body.STATIC)
		body.addShape(shape);
		body.shapes[0].collisionMask = 6
		body.angle = angle;
		body.position[0] = x;
		body.position[1] = y;
		this.world.addBody(body);
		return body;
	}

	/**创建刚体 */
	private getBody(mass: number = 0, type: number = p2.Body.DYNAMIC): p2.Body {
		var body = new p2.Body({ mass: mass });
		body.type = type;
		body.displays = [];
		return body;
	}

	public loopBackFun: any


	//帧事件，步函数
	private update() {
		let now = egret.getTimer();
		let pass = now - this.timeOnEnterFrame;
		let dt: number = 1000 / pass;
		this.timeOnEnterFrame = egret.getTimer();
		this.world.step(1 / 60, dt / 1000, 10);
		var l = this.world.bodies.length;
		for (var i: number = 0; i < l; i++) {
			var boxBody: p2.Body = this.world.bodies[i];
			var box: egret.DisplayObject = boxBody.displays[0];
			if (box) {
				box.x = boxBody.position[0];
				box.y = boxBody.position[1];
			}
		}
		if (this.loopBackFun != null) {
			this.loopBackFun();
		}
	}

	/**创建圆形刚体与圆形形状 */
	public createCircleBodyShape(radius: number, type: number = p2.Body.DYNAMIC): p2.Body {
		var body = this.getBody(10, type);
		var shape: p2.Shape = new p2.Circle({ radius: radius });
		body.addShape(shape);
		this.world.addBody(body);
		return body;
	}

	/**
	 * 创建方形刚体与形状
	 * angle=rotation*Math.PI/180
	 */
	public createBoxBodyShape(width: number, height: number, type: number = p2.Body.DYNAMIC, angle: number = 0): p2.Body {
		var body = this.getBody(10, type);
		var shape: p2.Shape = new p2.Box({ width: width, height: height });
		body.addShape(shape);
		body.angle = angle;
		this.world.addBody(body);
		return body;
	}

	/**创建多边形刚体与形状(值得注意的是锚点要在中间，这样就不能从[0,0]开始) */
	public createConvexBodyShape(points: any[], type: number = p2.Body.DYNAMIC): p2.Body {
		var body: p2.Body = this.getBody(10, type);
		body.fromPolygon(points, { optimalDecomp: false });
		this.world.addBody(body);
		return body;
	}
	/**创建正多边形,side边数，radius为半径*/
	public createPolygon(side: number = 3, radius: number = 30, type: number = p2.Body.DYNAMIC): p2.Body {
		var body: p2.Body = this.getBody(10, type);
		var points: any[] = [];
		for (var i: number = 0; i < side; i++) {
			var x: number = Math.cos((i * (360 / side) * Math.PI / 180)) * radius;
			var y: number = Math.sin((i * (360 / side) * Math.PI / 180)) * radius;
			points.push([x, y]);
		}
		return this.createConvexBodyShape(points, type)
	}

	//显示圆形
	public displayCircle(bitmap: string, circleShape: p2.Shape): egret.Bitmap {
		var tu = GameConst.CreateBitmapByName(bitmap)
		tu.width = (<p2.Circle>circleShape).radius * 2
		tu.height = (<p2.Circle>circleShape).radius * 2
		tu.anchorOffsetX = tu.width / 2
		tu.anchorOffsetY = tu.height / 2;
		tu.x = -500
		return tu;
	}

	//显示正方形
	public displayBox(bitmap: string, boxShape: p2.Box, x: number, y: number, rotation: number = 0): egret.Bitmap {
		var tu = GameConst.CreateBitmapByName(bitmap)
		tu.width = boxShape.width
		tu.height = boxShape.height
		tu.rotation = rotation
		tu.anchorOffsetX = tu.width / 2
		tu.anchorOffsetY = tu.height / 2;
		tu.x = -500
		return tu;
	}

	//显示多边形
	public displayConvex(bitmap: string, width: number, height: number, x: number, y: number, rotation: number = 0): egret.Bitmap {
		var tu = GameConst.CreateBitmapByName(bitmap)
		tu.width = width
		tu.height = height
		tu.rotation = rotation
		tu.anchorOffsetX = tu.width / 2
		tu.anchorOffsetY = tu.height / 2;
		tu.x = -500
		return tu;
	}

	//显示直线
	public displayLine(bitmap: string, linenum: number): egret.DisplayObject {
		var tu = GameConst.CreateBitmapByName(bitmap)
		tu.width = linenum
		tu.height = 1
		tu.anchorOffsetX = tu.width / 2
		tu.anchorOffsetY = tu.height / 2;
		return tu;
	}

}