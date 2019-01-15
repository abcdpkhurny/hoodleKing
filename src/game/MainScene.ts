class MainScene extends eui.Component implements eui.UIComponent {
	public mbtnMuise: eui.ToggleButton;
	public mbtnRanking: eui.ToggleButton;
	public mbtnStart: eui.ToggleButton;
	public mbtnShare: eui.ToggleButton;
	public mbtnInfo: eui.ToggleButton;

	public mbtns: eui.ToggleButton[];

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.mbtns = [this.mbtnStart, this.mbtnRanking, this.mbtnShare, this.mbtnInfo];
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			// 事件委托, 点击按钮的时候触发toggleBtn
			this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
				let theBtn = <eui.ToggleButton>e.target
				this.toggleBtn(theBtn)
			}, this)
		}
		// this.mbtnMuise.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
		// 	if (this.mbtnMuise.selected) {
		// 		//打开音乐
		// 	} else {
		// 		//关闭音乐
		// 	}
		// }, this)
	}

	/**
 * 切换按钮
 * @param btn 参数是eui.ToggleButton的时候切换按钮, 参数是0的时候设置为全部不选中
 */
	public toggleBtn(btn: eui.ToggleButton | number) {
		//console.log('点击')

		// 先把所有的按钮都设置为不选中
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			this.mbtns[i].selected = false
		}
		if (btn === 0) {
			//console.log('返回');
			return
		}

		btn = <eui.ToggleButton>btn

		// 获取当前点击的按钮的下标, 用来实现不同按钮对应的功能
		// 0 1 2 3 4 对应 开始游戏, 排行，分享,说明
		let index = this.mbtns.lastIndexOf(btn)
		switch (index) {
			case 0:
				console.log("开始游戏")
				SceneManager.toPlayScene();
				//console.log(GameConst.StageW + "," + GameConst.StageH);
				//console.log(this.stage.stageWidth + "," + this.stage.stageHeight);
				break
			case 1:
				this.onButtonClick()
				console.log("排行")
				break
			case 2:
				platform.shareAppMessage()
				console.log("分享")
				break
			case 3:
				this.onClickInfo()
				console.log("说明")
			default:
				break
		}
	}

	private onClickInfo() {
		if (!this.mainInfo) this.mainInfo = new MainInfo()
		this.addChild(this.mainInfo)
	}

	private mainInfo: MainInfo
	public ranking: Ranking

	/**
	 * 点击按钮
	 * Click the button
	 */
	private onButtonClick() {
		this.ranking = SceneManager.instance.ranking
		this.ranking.initParent(this)
		this.ranking.hasRestart = false
		//this.ranking.curScore = 0;
		this.ranking.allRanking()
	}

}