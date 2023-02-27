var res = {
	//Audio
	audio_button:" res/Audio/buttom.mp3",
	audio_dead:"res/Audio/dead.mp3",
	audio_gameover:"res/Audio/gameover.mp3",
  audio_next_level:"res/Audio/next_level.mp3",
  audio_perfect:"res/Audio/perfect.mp3",
  
  mm_bg : "res/MainMenu/background.jpg",
  mm_branch : "res/MainMenu/branch.png",
  mm_squash : "res/MainMenu/squash.png",
  mm_tree : "res/MainMenu/tree.png",
  mm_house : "res/MainMenu/house.png",
  mm_title : "res/MainMenu/title.png",
  mm_xi : "res/MainMenu/xi.png",
  mm_mei : "res/MainMenu/mei.png",
  mm_lan : "res/MainMenu/lan.png",
  mm_rule : "res/MainMenu/btn_rule.png",
  mm_start : "res/MainMenu/btn_start.png",
  mm_record : "res/MainMenu/btn_record.png",

  gp_main_plist:"res/GamePlay/main.plist",
  gp_main_png:"res/GamePlay/main.png",
	gs_main_0_plist:"res/GameResult/main_0.plist",
  gs_main_0_png:"res/GameResult/main_0.png",
	gs_main_1_plist:"res/GameResult/main_1.plist",
  gs_main_1_png:"res/GameResult/main_1.png"
}
var g_resources=[];
for (var i in res) {
    g_resources.push(res[i]);
}
