STATE_PLAYING = 0;
STATE_GAMEOVER = 1;


//外层引用
var s_GameMainLayer;

var GameMainLayer = cc.Layer.extend({
    timeout:30,

    bgSprite:null,
    mAvatars:null,
    scoreLabel:null,
    score:null,
    timeoutLabel:null,
    player:null,
    _state:STATE_PLAYING,
    //avatarBatch:null,

    ctor:function(){
        this._super();
        s_GameMainLayer = this;

        this.initGame();

        this.initBatchNode();

        this.initPlayer();

        this.addAvatar();

        this.presetAvatars();

        this.initScoreTime();

        this.addEvent();

        this.schedule(this.update,1,16*1024,1);
        //timer倒计时60
        this.schedule(this.timer,1,this.timeout,1);
    },

    initGame:function() {
        GameConfig.mWinSize = cc.winSize;
        this.score = 0;
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
    //预置一些头像到对象池中
    presetAvatars: function () {

        AvatarSprite.avatars = [];
        var typeSize = GameConfig.sizeMap.length;
        for (var i = 0; i <= typeSize; i++) {
            for(var j=0;j<=typeSize;j++){
                var avatar = new AvatarSprite(i);
                avatar.active = false;
                avatar.visible = false;
            }
        }
    },
    addAvatar:function(){
        //for(var i=0;i<2;i++){
            var avatar = new AvatarSprite(1);
            var x = avatar.width/2+GameConfig.mWinSize.width/2 * cc.random0To1();
            avatar.attr({
                x:x,
                y:GameConfig.mWinSize.height -30
            });

            this.addChild(avatar,5);

            var dorpAction = cc.moveTo(4, cc.p(avatar.x,-30));
            avatar.runAction(dorpAction);
            this.mAvatars.push(avatar);
        //}
    },

    removeAvatar : function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.mAvatars.length; i++) {
            //cc.log("removeSushi.........");
            //if(0 == this.mAvatars[i].y) {
            if(this.mAvatars[i].y < this.mAvatars[i].height +1) {
                //cc.log("==============remove:"+i);
                this.mAvatars[i].removeFromParent();
                this.mAvatars[i] = undefined;
                this.mAvatars.splice(i,1);
                i= i-1;
            }
        }
    },

    addEvent:function(){
        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function (key, event) {
                    //MW.KEYS[key] = true;
                },
                onKeyReleased:function (key, event) {
                    //MW.KEYS[key] = false;
                }
            }, this);

        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().processEvent(event);
                }
            }, this);

        if (cc.sys.capabilities.hasOwnProperty('touches')){
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    var touch = touches[0];
                    if (this.prevTouchId != touch.getID())
                        this.prevTouchId = touch.getID();
                    else event.getCurrentTarget().processEvent(touches[0]);
                }
            }, this);
        }
    },

    processEvent:function (event) {
        if (this._state == STATE_PLAYING) {
            var delta = event.getDelta();
            var curPos = cc.p(this.player.x, this.player.y);
            curPos = cc.pAdd(curPos, delta);
            curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(cc.winSize.width, cc.winSize.height));
            this.player.x = curPos.x;
            //this.player.y = curPos.y;
            curPos = null;
        }
    },

    update:function(){
        this.addAvatar();
        this.removeAvatar();
        this.updateAvatars();
        this.checkIsCollide();
    },

    //更新月饼
    updateAvatars: function () {
        var avatars = this.mAvatars;
        var len = avatars.length;

        while (len--) {
            var avatar = avatars[len];
            if (!avatar.active) {
                avatars.splice(len, 1);
            } else {
                avatar.update();
            }
        }
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
        this.timeoutLabel.x = 80;
        this.timeoutLabel.y = GameConfig.mWinSize.height - 20;
        this.addChild(this.timeoutLabel, 5);
    },

    addScore:function(){
        //this.score +=1;
        this.scoreLabel.setString("得分: " + this.score);
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
        this.timeoutLabel.setString("时间: " + this.timeout);
    },

    //碰撞检测
    checkIsCollide: function () {
        var avatar;
        for (var i = 0, len = this.mAvatars.length; i < len; i++) {
            avatar = this.mAvatars[i];
            if (avatar.active) {
                var player = this.player;
                if (this.collide(avatar, player)) {
                    avatar.hurt();
                    player.hurt(avatar);
                    //cc.log("this.score--->"+this.score+"   avatar.value--->"+avatar.value);

                    this.score += avatar.value;
                    //var score = this.score;
                    this.addScore();
                    //switch (true) {
                    //    case score >= GC.score.overflow:
                    //        player.basket = GC.BASKET.OVERFLOW;
                    //        break;
                    //    case score >= GC.score.full:
                    //        player.basket = GC.BASKET.FULL;
                    //        break;
                    //    case this.score >= GC.score.little:
                    //        player.basket = GC.BASKET.LITTLE;
                    //        break;
                    //}
                    if (avatar.type === 0) {
                        if (!--this.life) {
                            avatar.destroy();
                            //this.gameOver(GC.GAME_RESULT.LOSE);
                        }
                        //this.spLife.update(this.life);
                    }
                }
            }
        }

        //var prop;
        //for (var i = 0, len = this.props.length; i < len; i++) {
        //    prop = this.props[i];
        //    if (prop.active) {
        //        var player = this.player;
        //        if (this.collide(prop, player)) {
        //            prop.hurt();
        //            switch (prop.type) {
        //                case GC.PROP.BASKET:
        //                    prop.visible = false;
        //                    var avatars = this.avatars;
        //                    len = avatars.length;
        //                    for (var i = 0; i < len; i++) {
        //                        var avatar = this.avatars[i];
        //                        avatar.pauseSchedulerAndActions();
        //                    }
        //                    var action = cc.blink(1, 3);
        //                    var callback = cc.callFunc(function () {
        //                        player.growing = false;
        //                        player.type = GC.RABBIT.BIG;
        //                        for (var i = 0; i < len; i++) {
        //                            var avatar = avatars[i];
        //                            avatar.resumeSchedulerAndActions();
        //                        }
        //                    });
        //                    player.growing = true;
        //                    player.runAction(cc.sequence(action, callback));
        //                    if (GC.musicOn) {
        //                        cc.audioEngine.playEffect(res.basket_music);
        //                    }
        //                    break;
        //                case GC.PROP.CARROT:
        //                    this.life++;
        //                    this.spLife.update(this.life);
        //                    if (GC.musicOn) {
        //                        cc.audioEngine.playEffect(res.life_music);
        //                    }
        //                    break;
        //                case GC.PROP.LESSBOOM:
        //                    this.difficulty = GC.DIFFICULTY.EASY;
        //                    if (GC.musicOn) {
        //                        cc.audioEngine.playEffect(res.lessboom_music);
        //                    }
        //                    break;
        //                case GC.PROP.CLOCK:
        //                    this.totalTime += 30;
        //                    if (GC.musicOn) {
        //                        cc.audioEngine.playEffect(res.clock_music);
        //                    }
        //                    break;
        //            }
        //        }
        //
        //    }
        //}
    },

    //检测算法
    collide: function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var bx = b.x;
        var by = b.y;

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    }

});