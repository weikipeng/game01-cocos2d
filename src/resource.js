var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    GameBg:"res/GameBg.png",
    avatars_png:"res/avatars.png",
    avatars_plist:"res/avatars.plist",
    game_title:"res/game_title.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}