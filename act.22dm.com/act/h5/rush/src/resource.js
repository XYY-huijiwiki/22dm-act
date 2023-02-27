var res = {
	audio_button:" res/Audio/button.mp3",
	audio_germ:" res/Audio/germ.mp3",
	audio_gold:" res/Audio/gold.mp3",
	audio_ice:" res/Audio/ice.mp3",
	audio_strong:" res/Audio/strong.mp3",
	audio_jump:" res/Audio/jump.mp3",
	audio_skill:" res/Audio/skill.mp3",
	audio_gameover:" res/Audio/gameover.mp3",

	public_bg:"res/Public/background.jpg",
  
	mm_bg:"res/MainMenu/mm_bg.jpg",
	mm_main_plist:"res/MainMenu/main.plist",
  mm_main_png:"res/MainMenu/main.png",
  
	gp_main_plist:"res/GamePlay/main.plist",
	gp_main_png:"res/GamePlay/main.png",

	gs_main_plist_0:"res/GameResult/main_0.plist",
	gs_main_plist_1:"res/GameResult/main_1.plist",
	gs_main_png_0:"res/GameResult/main_0.png",
	gs_main_png_1:"res/GameResult/main_1.png"
}
var g_resources=[];
for (var i in res) {
    g_resources.push(res[i]);
}
