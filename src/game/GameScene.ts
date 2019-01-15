class GameScene extends eui.Component {

	public constructor() {
		super()
	}
	private world: P2World;			//2D物理世界
	private material: p2.Material;	//碰撞时的弹性变化
	private barrier: Barrier;		//随机生成障碍物
	private playInfo: PlayInfo;		//游戏说明

	/**背景 */
	private bg: egret.Bitmap

	/**准备发球数组 */
	private prepareBalllist: Array<p2.Body> = [];
	/**发球数组 */
	private ballBodylist: Array<p2.Body> = [];
	/**回收数组 */
	private recyclelist: Array<p2.Body> = [];
	/**障碍物数组 */
	private barrierlist: Array<p2.Body> = [];
	/**墙数组 */
	private wallslist: Array<p2.Plane> = [];
	/**边界组 */
	private confinelist: Array<p2.Body> = [];
	/**地面组 */
	private pedestallist: Array<p2.Body> = [];

	/**准备结束 */
	//private prepareOver: boolean = false;
	/**一轮结束 */
	private oneRotateOver: boolean = false;
	/**游戏结束 */
	//private gameOver: boolean = false;

	/**球的总数 */
	private ballSum = 0
	/**分数 */
	private scores = 0
	/**轮 */
	private round = 1
	/**每局加球数 */
	private ballUp = 0
	private ballSumText: egret.TextField
	private scoresText: egret.TextField
	private roundText: egret.TextField

	init() {
		this.ballSum = 0
		this.scores = 0
		this.round = 1
		this.oneRotateOver = false
		this.prepareBalllist = []
		this.ballBodylist = []
		this.recyclelist = []
		this.barrierlist = []
		this.controlBacksh(false)
	}

	//游玩
	public toPlay() {
		this.init();
		//创建背景
		this.bg = GameConst.CreateBitmapByName("play_bg_jpg");
		this.addChild(this.bg)
		//ufo
		var ufo = GameConst.CreateBitmapByName("play_ufo_png");
		ufo.x = GameConst.StageW / 2 - ufo.width / 2
		ufo.y = 90
		this.addChild(ufo)

		this.world = new P2World(this.bg.width, this.bg.height);
		this.addChild(this.world)
		this.world.init();
		var world = this.world.p2World
		//最边上的墙,上，左，下，右
		this.wallslist = this.world.createWall();
		//边界,右，左，上
		this.confinelist = this.world.createConfine();
		//底座,左，右
		this.pedestallist = this.world.createPedestal();
		this.prepareBalllist.push(this.createBall());
		this.world.p2World.addBody(this.prepareBalllist[0]);
		this.addChild(this.prepareBalllist[0].displays[0]);

		//material
		//this.material = new p2.Material(10)
		//一键发球
		//this.world.stage.once(egret.TouchEvent.TOUCH_END, this.runBall, this);
		this.world.loopBackFun = this.loopBackFun.bind(this);
		this.preSolveEquation();
		//障碍物
		this.barrier = new Barrier(this.bg.width, this.bg.height)
		this.addChild(this.barrier)
		this.barrier.world = this.world
		var blist: any[] = this.barrier.updateBarrier(this.scores, this.prepareBalllist.length, this.round);
		// console.log(blist)
		// console.log(this.prepareBalllist)
		this.addBarrierMaterial(blist, this.prepareBalllist)
		this.addBarrier(blist)

		this.ballSumText = new egret.TextField();
		this.ballSumText.text = "球:" + 100;
		this.ballSumText.x = GameConst.StageW * 55 / 640
		this.ballSumText.y = 120
		this.ballSumText.size = 22;
		this.addChild(this.ballSumText);

		this.scoresText = new egret.TextField();
		this.scoresText.text = "分:" + 10000
		this.scoresText.x = GameConst.StageW * 55 / 640
		this.scoresText.y = 150
		this.scoresText.size = 22;
		this.addChild(this.scoresText);

		this.roundText = new egret.TextField();
		this.roundText.text = "轮:" + 1
		this.roundText.x = GameConst.StageW * 500 / 640
		this.roundText.y = 150
		this.roundText.size = 22;
		this.addChild(this.roundText);
		//this.world.stage.once(egret.TouchEvent.TOUCH_END, this.runBall, this);
		this.openCheckUI();
	}

	/**计算成绩 */
	private sumScores() {
		this.roundText.text = "轮：" + this.round
		this.scoresText.text = "分：" + this.scores
		this.ballSumText.text = "球：" + this.prepareBalllist.length
	}

	private ballBody: p2.Body;
	/**贴图 */
	private display: egret.DisplayObject;
	private factor: number = 30;
	/**发球定时器 */
	private sendBallTime

	private createBall(): p2.Body {
		var world = this.world;
		//添加圆形刚体
		//玩家弹珠
		var rs = 16;
		var circleShape: p2.Shape = new p2.Circle({ radius: rs });
		//可以为任何形状
		var body = new p2.Body({
			mass: 10,
			//type: p2.Body.KINEMATIC,
			position: [GameConst.StageW / 2, 220]
		});

		body.addShape(circleShape);
		body["flag"] = "ball"
		this.display = world.displayCircle("handle_png", circleShape);
		body.displays = [this.display];
		body.angularVelocity = 0
		body.damping = 0;
		body.shapes[0].collisionGroup = 2

		this.addBallMaterial(body);
		return body
	}

	/**开始游戏 */
	private runBall(e: egret.TouchEvent) {
		var world = this.world.p2World;
		var speed = 15 * this.factor;
		var angle = Math.atan2(e.stageY - this.prepareBalllist[0].position[1], e.stageX - this.prepareBalllist[0].position[0])
		//这为第一次发球
		var oneball = true;
		//这里用定时器
		this.sendBallTime = window.setInterval(() => {
			if (this.prepareBalllist.length > 0) {
				var ball = this.prepareBalllist.shift()
				//添加到发球组
				this.ballBodylist.push(ball)
				if (!oneball) {
					ball.position = [GameConst.StageW / 2, 220]
					world.addBody(ball);
					this.addChild(ball.displays[0]);
				}
				oneball = false;
				ball.velocity = [Math.cos(angle) * speed, Math.sin(angle) * speed]
			}
			if (this.prepareBalllist.length == 0) {
				this.world.p2World.gravity = [0, 10 * this.factor]
			}
		}, 200);
	}

	/**循环处理 */
	private loopBackFun() {
		this.sumScores();
		//球吸收完毕
		if (this.ballBodylist.length == 0 && this.prepareBalllist.length == 0 && this.oneRotateOver) {
			console.log("一轮结束")
			//这里要判断是否一轮完结
			console.log(this.prepareBalllist.length)
			if (this.prepareBalllist.length == 0) {
				this.oneRotateOver = false
				this.clearTime();
				this.round++
				this.world.p2World.gravity = [0, 0];
				var upY = 100;
				var flay = false
				console.log(this.barrierlist)
				for (var i = 0; i < this.barrierlist.length; i++) {
					var black = this.barrierlist[i];
					if (black.position[1] <= 400) {
						flay = true
					}
				}
				console.log("flay:" + flay)
				if (flay) {
					console.log("游戏结束")
					//this.gameOver = true
					this.openRanking();
				} else {
					//添加球数
					if (this.ballUp > 0) {
						var blist: any[] = []
						for (var i = 0; i < this.ballUp; i++) {
							blist.push(this.createBall())
						}
						this.addBarrierMaterial(this.barrierlist, blist, 1)
						this.recyclelist.push.apply(this.recyclelist, blist);
						console.log(this.recyclelist)
						this.ballUp = 0
					}
					//这里障碍块上升 ，上升一定高度则结束
					for (var i = 0; i < this.barrierlist.length; i++) {
						var black = this.barrierlist[i];
						egret.Tween.get(black).to({ position: [black.position[0], black.position[1] - upY] }, 500);
						egret.Tween.get(black.displays[0]).to({ y: black.displays[0].y - upY }, 500);
						if (black["skin"]) egret.Tween.get(black["skin"].txt).to({ y: black["skin"].txt.y - upY }, 500);
					}
					window.setTimeout(() => {
						var blist = this.barrier.updateBarrier(this.scores, this.recyclelist.length, this.round)
						this.addBarrier(blist)
						this.addBarrierMaterial(blist, this.recyclelist)
						this.rotateover();
					}, 500)
				}
			}

		}
	}

	public rankingUI: RankingUI
	public rankingNom: Ranking

	/**打开排行榜*/
	private openRanking() {
		if (!this.rankingUI)
			this.rankingUI = new RankingUI()
		this.controlBacksh(true)
		this.addChild(this.rankingUI)
		this.rankingUI.initNormal();
		this.rankingUI.textUse.text = this.rankingUI.textUse.text + this.scores + "分"
		this.rankingUI.textOldUse.text = this.rankingUI.textOldUse.text + GameConst.player.maxscore + "分"
		//更新自己服务器后台
		if (this.scores > GameConst.player.score) {
			let url: string = GameConst.url + "/hoodlePro/updateRankingScore.do"
			let param: string = "openid=" + GameConst.player.openid + "&score=" + this.scores
			let req = GameConst.reqGetJSON(url + "?" + param)
			req.addEventListener(egret.Event.COMPLETE, () => {
				//这里更新用户，然后把用户资料存到这里
				let data: string = req.response
				let josnDate = JSON.parse(data)
				console.log(josnDate)
				GameConst.player = josnDate.data
			}, this)
		}
		//更新微信后台
		this.rankingNom == SceneManager.instance.ranking
		if (!this.rankingNom) {
			this.rankingNom = new Ranking();
		}
		this.rankingNom.initParent(this)
		this.rankingNom.curScore = this.scores;
		this.rankingNom.updateMessage()
		//添加重新开始事件
		this.rankingUI.mbtnRestart.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.toPlay();
		}, this)
		//这个是返回
		this.rankingUI.mbtnBack.once(egret.TouchEvent.TOUCH_TAP, () => {
			GameConst.removeChild(this)
		}, this)
		this.rankingUI.mbtnRanking.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.controlBacksh(true)
			this.rankingNom.initParent(this);
			this.rankingNom.hasRestart = false
			this.rankingNom.curScore = this.scores;
			this.rankingNom.onButtonClick()
			this.rankingNom.btnClose.once(egret.TouchEvent.TOUCH_END, () => {
				GameConst.removeChild(this)
			}, this)
		}, this)
	}
	public checkUI: CheckUI
	//检验
	private openCheckUI() {
		if (!this.checkUI) {
			this.checkUI = new CheckUI()
		} else {
			this.checkUI.init()
		}
		console.log(1)
		this.controlBacksh(true)
		this.addChild(this.checkUI)
		this.checkUI.once(egret.Event.REMOVED_FROM_STAGE, () => {
			if (!this.checkUI.pass) {
				return
			}
			this.controlBacksh(false)
			this.checkUI.pass = false
			if (this.checkUI.isExit) {
				GameConst.removeChild(this)
			} else {
				if (this.oneOpenFlay) {
					this.oneOpenFlay = false
					this.playInfo = new PlayInfo();
					this.addChild(this.playInfo)
					this.playInfo.init()
					this.playInfo.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
						this.world.stage.once(egret.TouchEvent.TOUCH_END, this.runBall, this);
					}, this)
				} else {
					//一键发球
					this.world.stage.once(egret.TouchEvent.TOUCH_END, this.runBall, this);
				}
			}
		}, this)
	}
	/**第一次打开 */
	private oneOpenFlay = true
	/**黑底遮罩 */
	private backShp: egret.Shape
	/** 控制黑底出现*/
	private controlBacksh(flay: boolean) {
		if (!this.backShp) {
			this.backShp = new egret.Shape();
			this.backShp.graphics.beginFill(0x000000, 0.2);
			this.backShp.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
			this.backShp.graphics.endFill();
		}
		if (flay) {
			this.addChild(this.backShp)
		} else {
			GameConst.removeChild(this.backShp)
		}
	}

	/**清除所有定时器 */
	private clearTime() {
		window.clearInterval(this.sendBallTime)
	}

	//一轮结束初始化
	private rotateover() {
		this.prepareBalllist = this.recyclelist;
		this.recyclelist = [];
		var ball = this.prepareBalllist[0]
		ball.velocity = [0, 0]
		ball.position = [GameConst.StageW / 2, 220]
		this.world.p2World.addBody(ball);
		this.addChild(ball.displays[0]);
		this.world.stage.once(egret.TouchEvent.TOUCH_END, this.runBall, this);
		this.world.timeOnEnterFrame = egret.getTimer();
	}

	/**刚体碰撞处理 */
	private preSolveEquation() {
		var that = this;
		var world = this.world;
		this.world.p2World.on("preSolve", function (evt) {
			if (evt.contactEquations.length > 0) {
				for (var i = 0; i < evt.contactEquations.length; i++) {
					var d = evt.contactEquations[i];
					var speed = 30 * that.factor
					//这里要循环输出球的集合
					for (var j = that.ballBodylist.length - 1; j >= 0; j--) {
						var ball = that.ballBodylist[j];
						var other: p2.Body
						if (d.bodyA == ball) other = d.bodyB
						if (d.bodyB == ball) other = d.bodyA
						//障碍块碰撞处理
						if ((d.bodyA == ball && d.bodyB["hit"] || d.bodyB == ball && d.bodyA["hit"]) && other["num"]) {
							//console.log("有数")
							other["skin"].update();
							that.scores++
							//判断分数小于等于0则，取消球体
							if (other["skin"].value <= 0) {
								that.removeObjList(that.barrierlist, other)
								//console.log(that.barrierlist)
								that.removeP2Body(other)
							}
						} else if ((d.bodyA == ball && d.bodyB["hit"] || d.bodyB == ball && d.bodyA["hit"]) && !other["num"]) {
							//console.log("没数")
							that.removeObjList(that.barrierlist, other)
							that.removeP2Body(other)
							that.ballUp++
						}
						//墙的碰撞处理
						if (d.bodyA.id == that.pedestallist[1].id && d.bodyB == ball || d.bodyB.id == that.pedestallist[1].id && d.bodyA == ball ||
							(d.bodyA.id == that.wallslist[3].id && d.bodyB == ball) || (d.bodyB.id == that.wallslist[3].id && d.bodyA == ball)) {
							//右
							if (ball.position[0] >= that.bg.width - 20) {
								ball.velocity = [0, -1000]
							} else {
								var angle = Math.atan2(302, 57)
								ball.velocity = [Math.cos(angle) * speed, Math.sin(angle) * speed]
							}
						} else if (d.bodyA.id == that.pedestallist[0].id && d.bodyB == ball || d.bodyB.id == that.pedestallist[0].id && d.bodyA == ball ||
							(d.bodyA.id == that.wallslist[1].id && d.bodyB == ball) || (d.bodyB.id == that.wallslist[1].id && d.bodyA == ball)) {
							//左
							if (ball.position[0] <= 20) {
								ball.velocity = [0, -1000]
							} else {
								var angle = Math.atan2(302, -57)
								ball.velocity = [Math.cos(angle) * speed, Math.sin(angle) * speed]
							}
						} else if ((d.bodyA.id == that.wallslist[2].id && d.bodyB == ball) || (d.bodyB.id == that.wallslist[2].id && d.bodyA == ball) ||
							(d.bodyA.id == that.wallslist[0].id && d.bodyB == ball) || (d.bodyB.id == that.wallslist[0].id && d.bodyA == ball)) {
							//上，底
							//这里应该要扔去回收站
							that.ballBodylist.splice(j, 1);
							that.recyclelist.push(ball);
							that.initClearBall(ball);
							if (that.ballBodylist.length == 0 && that.prepareBalllist.length == 0 && !that.oneRotateOver) {
								console.log("结束")
								that.oneRotateOver = true;
							}
						}
					}
				}
			}
		})
	}

	/**删除数组中的对象 */
	private removeObjList(list: any[], obj: any) {
		for (var j = list.length - 1; j >= 0; j--) {
			var l = list[j]
			if (l == obj) {
				list.splice(j, 1);
				break;
			}
		}
	}

	private removeP2Body(body: p2.Body) {
		var world = this.world
		world.p2World.removeBody(body)
		if (body.displays[0]) GameConst.removeChild(body.displays[0])
		if (body["skin"]) GameConst.removeChild(body["skin"].txt)
	}

	/**初始化球体 */
	private initClearBall(ball: p2.Body) {
		this.removeP2Body(ball)
		ball.position = [-500, 220]
		ball.velocity = [0, 0]
		ball.displays[0].x = -500
	}

	/**添加到障碍物数组 */
	private addBarrier(list: any[]) {
		for (var i = 0; i < list.length; i++) {
			var barrier = list[i];
			barrier.shapes[0].collisionMask = 6;
			this.barrierlist.push(barrier)
		}
	}

	/**障碍物与球添加关系 type=0为球体已存在关系 1为障碍物*/
	private addBarrierMaterial(barrierlist: any[], balllist: any[], type: number = 0) {
		for (var i = 0; i < barrierlist.length; i++) {
			var barrier = barrierlist[i];
			for (var j = 0; j < balllist.length; j++) {
				var ball = balllist[j]
				if (type == 0) this.setMaterial(barrier, ball);
				else if (type == 1) this.setMaterial(ball, barrier);
			}
		}
	}

	/**3墙实现完全弹性碰撞 */
	private addBallMaterial(ball: p2.Body) {
		var world = this.world.p2World
		var materialA = new p2.Material(ball.id);
		ball.shapes[0].material = materialA;

		for (var i = 0; i < this.confinelist.length; i++) {
			var wall = this.confinelist[i]
			var materialB = new p2.Material(wall.id);
			wall.shapes[0].material = materialB;
			var contactMaterial: p2.ContactMaterial = new p2.ContactMaterial(materialA, materialB);
			contactMaterial.restitution = 1;
			contactMaterial.friction = 0;
			world.addContactMaterial(contactMaterial);
		}
	}

	/** 设置刚体碰撞的弹性 body1为未存在关系，body2为已存在关系*/
	private setMaterial(body1: p2.Body, body2: p2.Body): void {
		var materialA = new p2.Material(body1.id);
		body1.shapes[0].material = materialA;
		var roleAndStoneMaterial: p2.ContactMaterial = new p2.ContactMaterial(materialA, body2.shapes[0].material);//弹性，摩擦力
		roleAndStoneMaterial.restitution = 1; //弹力
		roleAndStoneMaterial.friction = 0; //摩擦力
		this.world.p2World.addContactMaterial(roleAndStoneMaterial);
	}
}