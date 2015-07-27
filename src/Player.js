var PlayerSprite = cc.Sprite.extend({
    ctor:function(){
        this._super();

        var frame = cc.spriteFrameCache.getSpriteFrame("xbb.png");
        //console.log("player frame --->"+frame);
        this.setSpriteFrame(frame);
    },

    hurt: function (avatar) {
        if (avatar.type === 0) {
            //var explosion = new ExplosionSprite();
            //explosion.x = avatar.x;
            //explosion.y = avatar.y;
            //explosion.play();
            //g_GPTouchLayer.texExplosionBatch.addChild(explosion);
        } else {
            //var plus = PlusSprite.getOrCreatePlus(avatar.value);
            //plus.x = avatar.x;
            //plus.y = avatar.y;
            //var actionTo = cc.moveTo(0.3, cc.p(plus.x, plus.y + 80));
            //var actionFadeOut = cc.fadeOut(1);
            //var callback = cc.callFunc(function (plus) {
            //    plus.destroy();
            //});
            //plus.runAction(cc.sequence(actionTo, actionFadeOut, callback));
            //g_GPTouchLayer.texIconsBatch.addChild(plus);
            //
            //if (GC.musicOn) {
            //    cc.audioEngine.playEffect(res.cake_music);
            //}
        }
    },

    collideRect: function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h);
    },
    destroy: function () {
        this.visible = false;
    }
});