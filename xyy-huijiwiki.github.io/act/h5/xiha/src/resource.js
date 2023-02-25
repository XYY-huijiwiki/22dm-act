var res = {
	//Audio
	audio_music:"res/Audio/music.mp3",
	audio_bullect1:"res/Audio/bullect1.mp3",
	audio_bullect2:"res/Audio/bullect2.mp3",
	audio_transform:"res/Audio/transform.mp3",
	audio_die:"res/Audio/die.mp3",
	audio_gameover:"res/Audio/gameover.mp3",
	audio_next:"res/Audio/next.mp3",
	audio_none:"res/Audio/none.mp3",
	audio_click:"res/Audio/click.mp3",
	audio_collide:"res/Audio/collide.mp3",

	// MainMenu
	btn_plist:"res/Btn/btn.plist",
	btn_png:"res/Btn/btn.png",
	 
	mm_bg_index:"res/MainMenu/bg_index.jpg",
	mm_bg_rule_1:"res/MainMenu/bg_rule_1.png",
	mm_bg_rule_2:"res/MainMenu/bg_rule_2.png",

	gp_bg_index_1:"res/GamePlay/bg_index_1.jpg",
	gp_bg_index_2:"res/GamePlay/bg_index_2.png",
	gp_bg_index_1_2:"res/GamePlay/bg_index_1_2.jpg",
	gp_bg_index_2_2:"res/GamePlay/bg_index_2_2.png",
	gp_bg_ice:"res/GamePlay/ice.png",
	gp_main_plist:"res/GamePlay/main.plist",
	gp_main_png:"res/GamePlay/main.png",

	gs_ui_title:"res/GameResult/ui_title.png",
	gs_ui_new:"res/GameResult/ui_new.png"
};
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}