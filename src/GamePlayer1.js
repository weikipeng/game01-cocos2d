var GamePlayerLayer = cc.Layer.extend({
    mWinSize:null,
    mScaleX:1,
    mScaleY:1,
    mAllScale:1,

    ctor:function() {
        this._super();

        this.initGame();

        this.initBg();

    },
    initGame:function(){
        this.winSize = cc.winSize;
        //this.scaleX = this.winSize.width/GameConfig.BG_W;
        //this.scaleY = this.winSize.height/GameConfig.BG_H;
        //
        //this.allScale = this.scaleY;
        //
        //if(this.scaleY > this.scaleX) {
        //    this.allScale = this.scaleX;
        //}

        console.log("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
            +cc.visibleRect.width +"X"+cc.visibleRect.height);

    },
    initBg:function(){
        alert("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
            +cc.visibleRect.width +"X"+cc.visibleRect.height);

        //this.bgSprite = new cc.Sprite(res.GameBg);
        //this.bgSprite.attr({
        //    anchorX:0,
        //    anchorY:0,
        //    x:0,
        //    y:0,
        //    scaleY:this.scaleY,
        //    scaleX:this.scaleX
        //});
        //
        //this.addChild(this.bgSprite,0);






        //var loadingBgH = 1334;
        //var loadingBgW = 750;
        //var scaleX = this._visibleRect.width/loadingBgW;
        //var scaleY = this._visibleRect.height/loadingBgH;
        //var allScale = scaleY;
        //if(scaleY > scaleX) {
        //    allScale = scaleX;
        //}
        //
        ////this._scaleX = scaleX;
        ////this._scaleY = scaleY;
        ////this._allScale = allScale;
        //
        //console.log("width:"+this._visibleRect.width+"------height:"+this._visibleRect.height+"---scaleY:"+scaleY+"---scaleX:"+scaleX);
        //console.log("this width:"+this.getContentSize().width+"   this ------height:"+this.getContentSize().height);
        //
        //alert("width:"+this._visibleRect.width+"------height:"+this._visibleRect.height+"---scaleY:"+scaleY+"---scaleX:"+scaleX);
        //alert("this width:"+this.getContentSize().width+"   this ------height:"+this.getContentSize().height);
    }
});

var GamePlayerScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new GamePlayerLayer();
        this.addChild(layer);
    }
});