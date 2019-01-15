class PlayInfo extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	public imgPoint: eui.Image
	public imgHand: eui.Image
	/**黑底遮罩 */
	private backShp: egret.Shape

	protected childrenCreated(): void {
		super.childrenCreated();
		this.backShp = new egret.Shape();
		this.backShp.graphics.beginFill(0x000000, 0.2);
		this.backShp.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
		this.backShp.graphics.endFill();
		this.backShp.touchEnabled = true
		this.addChild(this.backShp)
		this.backShp.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			GameConst.removeChild(this)
		}, this)
		this.init()
	}

	public init() {
		var pheight = this.imgPoint.height
		var twPoint = egret.Tween.get(this.imgPoint, { loop: true })
		twPoint.to({ rotation: 25, height: pheight + 25 }, 800).to({ rotation: 0, height: pheight }, 800).to({ rotation: -25, height: pheight + 25 }, 800).to({ rotation: 0, height: pheight }, 800)
		var twHand = egret.Tween.get(this.imgHand, { loop: true })
		twHand.to({ x: GameConst.StageW * 50 / 640 + this.imgHand.width / 2 }, 800).to({ x: GameConst.StageW * 1 / 2 }, 800).to({ x: GameConst.StageW * 592 / 640 - this.imgHand.width / 2 }, 800).to({ x: GameConst.StageW * 1 / 2 }, 800)
	}

}