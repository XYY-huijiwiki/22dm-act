var res = {
	//Audio
	audio_music:"res/Audio/music.mp3",
	audio_button:"res/Audio/button.mp3",
	audio_die:"res/Audio/die.mp3",
	audio_success:"res/Audio/success.mp3",
	audio_failed:"res/Audio/failed.mp3",

	public_btn_png:"res/Public/btn.png",
	public_btn_plist:"res/Public/btn.plist",
	
	mm_bg:"res/MainMenu/bg.jpg",
	mm_dance_png_0:"res/MainMenu/dance_0.png",
	mm_dance_png_1:"res/MainMenu/dance_1.png",
	mm_dance_png_2:"res/MainMenu/dance_2.png",
	mm_dance_plist_0:"res/MainMenu/dance_0.plist",
	mm_dance_plist_1:"res/MainMenu/dance_1.plist",
	mm_dance_plist_2:"res/MainMenu/dance_2.plist",

	gp_map_tmx:"res/GamePlay/map.tmx",
	gp_map_tsx:"res/GamePlay/map.tsx",
	gp_map:"res/GamePlay/map.png",
	gp_guide:"res/GamePlay/guide.png",
	gp_tips:"res/GamePlay/tips.png",
	gp_role_png:"res/GamePlay/role.png",
	gp_role_plist:"res/GamePlay/role.plist",

	gs_bg_bad:"res/GameResult/bad.jpg",
	gs_bg_soso:"res/GameResult/soso.jpg",
	gs_bg_good:"res/GameResult/good.jpg",
	gs_bg_best:"res/GameResult/best.jpg",
	gs_result_png_0:"res/GameResult/result_0.png",
	gs_result_png_1:"res/GameResult/result_1.png",
	gs_result_plist_0:"res/GameResult/result_0.plist",
	gs_result_plist_1:"res/GameResult/result_1.plist"
}
var g_resources=[];
for (var i in res) {
    g_resources.push(res[i]);
}
