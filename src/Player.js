var PlayerSprite = cc.Sprite.extend({
    ctor:function(){
        this._super();

        var frame = cc.spriteFrameCache.getSpriteFrame("xbb.png");
        //console.log("player frame --->"+frame);
        this.setSpriteFrame(frame);
    }
});