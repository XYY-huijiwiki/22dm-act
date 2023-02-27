var jf = {};        // 定义自己的命名空间
jf.EventName = {};  // 事件名字对象
jf.EventName.MM_RUN_GP= "MM_RUN_GP";

jf.EventName.GP_NEXT_LEVEL= "GP_NEXT_LEVEL";
jf.EventName.GP_TIMER_START= "GP_TIMER_START";
jf.EventName.GP_GAME_OVER= "GP_GAME_OVER";
jf.EventName.GP_CREATE_DIALOGS_LAYER = "GP_CREATE_DIALOGS_LAYER";
jf.EventName.GP_REMOVE_DIALOGS_LAYER ="GP_REMOVE_DIALOGS_LAYER";
jf.EventName.GP_UPDATE_TIMER_TEXT= "GP_UPDATE_TIMER_TEXT";
jf.EventName.GP_UPDATE_SCORE_TEXT= "GP_UPDATE_SCORE_TEXT";
jf.EventName.GP_UPDATE_SKILL_TEXT= "GP_UPDATE_SKILL_TEXT";
jf.EventName.GP_UPDATE_ARTICLE_TEXT= "GP_UPDATE_ARTICLE_TEXT";
jf.EventName.GP_CREATE_ARTICLE_TIP= "GP_CREATE_ARTICLE_TIP";
jf.EventName.GP_CREATE_FORBID_TIP= "GP_CREATE_FORBID_TIP";
jf.EventName.GP_SKILL_USE= "GP_SKILL_USE";
jf.EventName.GP_ADD_TIMER= "GP_ADD_TIMER";

var Config = {};
Config.IS_UP_UNLOCK_KEY = "is_up_unlock_key";

// var j = 10; 
// var z = 0;
// var c = 4;
// for(var k=0;k<100;k++){
// 	j = 10; 
// 	z = 0;
// 	for (var i=0;i<c;i++){
// 		var num = Math.floor(Math.random()*(j-c+i)+1);
// 		console.info(i==c-1?j:num);
// 		z += i==c-1?j:num;
// 		j -= num;
// 	}
// 	console.info("--------");
// }
// for (var i = 0; i <GameManager.currArticlePool.length; i++) {
// 	console.info(GameManager.currArticlePool[i].random);
// }