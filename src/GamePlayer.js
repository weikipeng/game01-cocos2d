var GamePlayerLayer = cc.Layer.extend({
    mWinSize:null,
    mScaleX:1,
    mScaleY:1,
    mAllScale:1,
    timeout:30,

    bgSprite:null,
    mAvatars:null,
    scoreLabel:null,
    timeoutLabel:null,
    player:null,
    avatarBatch:null,

    ctor:function() {
        this._super();

        this.initGame();

        this.initBatchNode();

        this.initBg();

        this.initPlayer();

        this.addAvatar();

        this.initScoreTime();

        this.schedule(this.update,1,16*1024,1);
        //timer倒计时60
        this.schedule(this.timer,1,this.timeout,1);

        return true;
    },
    initBatchNode:function(){
        var avatarPng = cc.textureCache.addImage(res.avatars_png);
        this.avatarBatch = new cc.SpriteBatchNode(avatarPng);
        this.addChild(this.avatarBatch);
    },
    initPlayer:function(){
        var tPlayer = this.player = new PlayerSprite();
        tPlayer.attr({
            x:this.mWinSize.width/2,
            y:GameConfig.PLAYER_H/2
        });
        this.addChild(tPlayer, 5);
    },
    addAvatar:function(){
        var avatar = new cc.Sprite(res.avatar_19);
        var x = avatar.width/2+this.mWinSize.width/2 * cc.random0To1();
        avatar.attr({
            x:x,
            y:this.mWinSize.height -30
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
            x:this.mWinSize.width / 2 + 100,
            y:this.mWinSize.height - 20
        });
        this.addChild(this.scoreLabel, 5);

        // timeout 60
        this.timeoutLabel = new cc.LabelTTF("时间: " + this.timeout, "Arial", 30);
        this.timeoutLabel.x = 20;
        this.timeoutLabel.y = this.mWinSize.height - 20;
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

        console.log("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
            +cc.visibleRect.width +"X"+cc.visibleRect.height);

        cc.spriteFrameCache.addSpriteFrames(res.avatars_plist);
    },
    initBg:function(){
        //alert("size--->"+cc.winSize.width+"X"+cc.winSize.height+"-----rect===>"
        //    +cc.visibleRect.width +"X"+cc.visibleRect.height);

        this.bgSprite = new cc.Sprite(res.GameBg);
        this.bgSprite.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0,
            scaleY:this.mScaleY,
            scaleX:this.mScaleX
        });

        this.addChild(this.bgSprite,0);
    }
});

var GamePlayerScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new GamePlayerLayer();
        this.addChild(layer);
    }
});