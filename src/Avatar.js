var AvatarSprite = cc.Sprite.extend({
    //active:false,
    //visible:false,

    ctor:function(){
        this._super();
        this.hp = 1;
        this.active = true;
        //生成随机数
        var max  = 9;
        var avatarType = Math.ceil(Math.random()*max);
        console.log("avatar avatarType ====>"+avatarType);

        var indexMax = GameConfig.sizeMap[avatarType-1];
        console.log("avatar indexMax ====>"+indexMax);

        var indexValue = Math.ceil(Math.random()*indexMax);
        console.log("avatar indexValue ====>"+indexValue);

        var frameName = avatarType+""+indexValue+".png";
        console.log("avatar frame name ====>"+frameName);
        console.log(" ");
        console.log(" ");
        console.log(" ");
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
    },

    update:function(){
        var h_2 = this.height/2 | 0;
        if(this.y < h_2 + 5){
            this.active = false;
        }
        if(this.hp<=0) {
            this.destory();
        }
    },
    destory:function(){
        this.visible = false;
        this.active = false;
        s_GameMainLayer.avatarBatch.removeChild(this);
    },

    hurt:function(){
        if(this.hp>0) {
            this.hp--;
        }
    }
});