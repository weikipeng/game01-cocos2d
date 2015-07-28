var GamePlayerLayer = cc.Layer.extend({

    backgroundLayer:null,
    gameLayer:null,

    ctor:function() {
        this._super();

        this.initGame();

        this.initBg();

        this.addGameLayer();

        return true;
    },

    initGame:function(){
        this.mAvatars = [];
        this.mWinSize = cc.winSize;
        this.mScaleX = this.mWinSize.width/GameConfig.BG_W;
        this.mScaleY = this.mWinSize.height/GameConfig.BG_H;

        this.mAllScale = this.mScaleY;

        if(this.mScaleY > this.mScaleX) {
            this.mAllScale = this.mScaleX;
        }

        GameConfig.SCALE_X = this.mScaleX;
        GameConfig.SCALE_Y = this.mScaleY;
        GameConfig.SCALE = this.mAllScale;

        //console.log("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
        //+cc.visibleRect.width +"X"+cc.visibleRect.height);
    },
    initBg:function() {
        this.backgroundLayer = new GameBackgroundLayer();
        this.addChild(this.backgroundLayer);

        //alert("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
        //    +cc.visibleRect.width +"X"+cc.visibleRect.height);
    },
    addGameLayer:function(){
        this.gameLayer = new GameMainLayer();
        this.addChild(this.gameLayer);
    }
});

var GamePlayerScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new GamePlayerLayer();
        this.addChild(layer);
    }
});