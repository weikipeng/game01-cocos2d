//外层引用
var s_GameMainLayer;

var GameMainLayer = cc.Layer.extend({
    timeout:30,

    bgSprite:null,
    mAvatars:null,
    scoreLabel:null,
    timeoutLabel:null,
    player:null,
    avatarBatch:null,

    ctor:function(){
        this._super();
        s_GameMainLayer = this;

        this.initGame();

        this.initBatchNode();

        this.initPlayer();

        this.addAvatar();

        this.initScoreTime();

        this.schedule(this.update,1,16*1024,1);
        //timer倒计时60
        this.schedule(this.timer,1,this.timeout,1);
    },
    initGame:function() {
        GameConfig.mWinSize = cc.winSize;
        this.mAvatars = [];
        cc.spriteFrameCache.addSpriteFrames(res.avatars_plist);
    },
    //通过BatchNode减少渲染个数, 优化性能
    initBatchNode: function () {
        var avatarPng = cc.textureCache.addImage(res.avatars_png);
        this.avatarBatch = new cc.SpriteBatchNode(avatarPng);
        this.addChild(this.avatarBatch);
    },

    initPlayer:function(){
        var tPlayer = this.player = new PlayerSprite();
        tPlayer.attr({
            x:GameConfig.mWinSize.width/2,
            y:GameConfig.PLAYER_H/2
        });
        this.addChild(tPlayer, 5);
    },

    addAvatar:function(){
        var avatar = new cc.Sprite(res.avatar_19);
        var x = avatar.width/2+GameConfig.mWinSize.width/2 * cc.random0To1();
        avatar.attr({
            x:x,
            y:GameConfig.mWinSize.height -30
        });

        this.addChild(avatar,5);

        var dorpAction = cc.moveTo(4, cc.p(avatar.x,-30));
        avatar.runAction(dorpAction);
        this.mAvatars.push(avatar);
    },

    removeAvatar : function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.mAvatars.length; i++) {
            cc.log("removeSushi.........");
            //if(0 == this.mAvatars[i].y) {
            if(this.mAvatars[i].y < this.mAvatars[i].height +1) {
                cc.log("==============remove:"+i);
                this.mAvatars[i].removeFromParent();
                this.mAvatars[i] = undefined;
                this.mAvatars.splice(i,1);
                i= i-1;
            }
        }
    },

    update:function(){
        this.addAvatar();
        this.removeAvatar();
    },
    initScoreTime:function(){
        this.scoreLabel = new cc.LabelTTF("得分: 0", "Arial", 20);
        this.scoreLabel.attr({
            x:GameConfig.mWinSize.width / 2 + 100,
            y:GameConfig.mWinSize.height - 20
        });
        this.addChild(this.scoreLabel, 5);

        // timeout 60
        this.timeoutLabel = new cc.LabelTTF("时间: " + this.timeout, "Arial", 30);
        this.timeoutLabel.x = 20;
        this.timeoutLabel.y = GameConfig.mWinSize.height - 20;
        this.addChild(this.timeoutLabel, 5);
    },
    addScore:function(){
        this.score +=1;
        this.scoreLabel.setString("时间: " + this.score);
    },
    timer : function() {

        if (this.timeout == 0) {
            //cc.log('游戏结束');
            var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x:size.width / 2 ,
                y:size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cc.MenuItemFont(
                "Try Again",
                function () {
                    cc.log("Menu is clicked!");
                    var transition= cc.TransitionFade(1, new PlayScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
            TryAgainItem.attr({
                x: size.width/2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.getParent().addChild(gameOver);

            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }

        this.timeout -=1;
        this.timeoutLabel.setString("" + this.timeout);
    }

});