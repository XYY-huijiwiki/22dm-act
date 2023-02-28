var res = {
	mm_main_plist:"res/MainMenu/main.plist",
  mm_main_png:"res/MainMenu/main.png",
	gp_main_plist:"res/GamePlay/main.plist",
  gp_main_png:"res/GamePlay/main.png",
	gs_main_plist:"res/GameResult/main.plist",
  gs_main_png:"res/GameResult/main.png",
  gs_background : "res/GameResult/gs_background.jpg",
  reserved : "res/Public/reserved.png",
  ercode : "res/Public/ercode.png",
  btn_share : "res/Public/btn_share.png",
  btn_replay : "res/Public/btn_replay.png"
}
var res_audio = {
  audio_button:" res/Audio/button.mp3",
  audio_normal:" res/Audio/normal.mp3",
  audio_perfect:" res/Audio/perfect.mp3",
  audio_miss:" res/Audio/miss.mp3",
  audio_gameover_normal:" res/Audio/gameover_normal.mp3",
  audio_gameover_best:" res/Audio/gameover_best.mp3"
}
var g_resources=[];
var a_resources=[];
for (var i in res) {
    g_resources.push(res[i]);
}
for (var j in res_audio) {
  a_resources.push(res_audio[j]);
}
