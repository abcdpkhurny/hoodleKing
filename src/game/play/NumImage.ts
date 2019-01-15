class NumImage extends egret.DisplayObjectContainer {
	private _value: number = -1;
	private txt: egret.TextField;

	public constructor() {
		super();
	}
	// public initNum(v: number): void {
	// 	this.txt = this.createText(0, 0);
	// 	this.value = v;
	// 	this.txt.text = String(v);
	// }
	public createText(x: number = 0, y: number = 0, s: string = "", that, width: number = 30, height: number = 30, rotation: number = 0, c: number = 0XFFFFFF, f: string = "黑体"): egret.TextField {
		this.txt = new egret.TextField()
		var text = this.txt
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
	}

	set value(v: number) {
		this._value = v;
		this.txt.text = String(v);
		//this.txt.textColor = 0;
	}
	get value(): number {
		return this._value;
	}

	public update(): void {
		this._value--;
		this.txt.text = String(this._value);
		//this.value = this._value;
		//console.log(this.value)
	}
}