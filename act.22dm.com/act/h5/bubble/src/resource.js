var res = {
	//Audio
	audio_button:" res/Audio/button.mp3",
	audio_find:" res/Audio/find.mp3",
	audio_shoot:" res/Audio/shoot.mp3",
	audio_gameover:" res/Audio/gameover.mp3",

	mm_main_plist:"res/MainMenu/main.plist",
  mm_main_png:"res/MainMenu/main.png",
  
	gp_main_png:"res/GamePlay/main.png",
  gp_main_plist:"res/GamePlay/main.plist",
  
	gs_main_png:"res/GameResult/main.png",
  gs_main_plist:"res/GameResult/main.plist",
  gs_bg:"res/Public/record/background.jpg"
}
var g_resources=[];
for (var i in res) {
    g_resources.push(res[i]);
}
