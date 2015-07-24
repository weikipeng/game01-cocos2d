var GameBackgroundLayer = cc.Layer.extend({
    ctor:function(color){
        this._super(color);
        this.initBackground();
    },

    initBackground:function(){
        var backgroundSprite = new cc.Sprite(res.GameBg);
        backgroundSprite.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0,
            scaleX:GameConfig.SCALE_X,
            scaleY:GameConfig.SCALE_Y
        });
        this.addChild(backgroundSprite);
    }
});