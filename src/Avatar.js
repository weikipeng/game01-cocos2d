

var AvatarSprite = cc.Sprite.extend({
    //active:false,
    //visible:false,

    ctor:function(type){
        this._super();
        this.hp = 1;
        this.active = true;

        this.value = type;

        var frameName = "boss.png";
        if(type != 0) {
            frameName = AvatarSprite.makeRadomNameByType(type);
        }

        console.log("avatar frame name ====>"+frameName);

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


AvatarSprite.getOrCreateMoonCake = function (type) {

    var avatar;

    for (var i = 0, len = AvatarSprite.avatars.length; i < len; i++) {
        avatar = AvatarSprite.avatars[i];
        if (avatar.active === false && avatar.visible === false && avatar.type === type) {
            avatar.hp = 1;
            avatar.opacity = 255;
            avatar.visible = true;
            avatar.active = true;

            return avatar;
        }
    }

    avatar = AvatarSprite.create(type);

    return avatar;
};

AvatarSprite.create = function (type) {

    var avatar = new AvatarSprite(type);

    AvatarSprite.avatars.push(avatar);

    return avatar;

};

AvatarSprite.makeRadomName = function(){
    //生成随机数
    var max  = GameConfig.sizeMap.length;
    var avatarType = Math.ceil(Math.random()*max);
    //console.log("avatar avatarType ====>"+avatarType);

    if(GameConfig.usedSizeMap[avatarType-1] == GameConfig.sizeMap[avatarType-1]) {
        return AvatarSprite.makeRadomName();
    }else{
        return AvatarSprite.makeRadomNameByType(avatarType);
    }
};

AvatarSprite.makeRadomNameByType = function(type){
    if(type == 0) {
        return "boss.png";
    }

    //console.log("used===>" + GameConfig.usedSizeMap[type - 1] + "    total===>" +GameConfig.sizeMap[type-1]);

    if(GameConfig.usedSizeMap[type-1] == GameConfig.sizeMap[type-1]) {
        return AvatarSprite.makeRadomName();
    }

    var indexMax = GameConfig.sizeMap[type-1];

    //console.log("avatar indexMax ====>"+indexMax);

    var indexValue = Math.ceil(Math.random()*indexMax);
    //console.log("avatar indexValue ====>"+indexValue);

    var frameName = type+""+indexValue+".png";
    //console.log("avatar frame name ====>"+frameName);

    if(GameConfig.avatarNameArray.indexOf(frameName)>=0) {
        //console.log("avatar frame name ====>"+frameName+"    exists!!!");
        if(GameConfig.avatarNameArray.length>=126) {
            return "boss.png";
        }else{
            return AvatarSprite.makeRadomNameByType(type);
        }

    }else{
        //console.log(" ");
        //console.log(" ");
        //console.log(" ");
        GameConfig.usedSizeMap[type-1]++;
        GameConfig.avatarNameArray.push(frameName);
        return frameName;
    }

};