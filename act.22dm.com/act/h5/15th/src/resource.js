var res = {
  audio_default: " res/Audio/default.mp3",

  main_plist_0: "res/GamePlay/main_0.plist",
  main_plist_1: "res/GamePlay/main_1.plist",
  main_plist_2: "res/GamePlay/main_2.plist",
  main_plist_3: "res/GamePlay/main_3.plist",
  main_plist_4: "res/GamePlay/main_4.plist",

  public_bg: "res/Public/background.jpg",
  main_png_0: "res/GamePlay/main_0.png",
  main_png_1: "res/GamePlay/main_1.png",
  main_png_2: "res/GamePlay/main_2.png",
  main_png_3: "res/GamePlay/main_3.png",
  main_png_4: "res/GamePlay/main_4.png",

  audio_button: " res/Audio/button.mp3",
  audio_xyy: " res/Audio/xyy.mp3",
  audio_film: " res/Audio/film.mp3",
  audio_bag: " res/Audio/bag.mp3",
  audio_remote: " res/Audio/remote.mp3",
  audio_fly: " res/Audio/fly.mp3",
  audio_alert: " res/Audio/alert.mp3",
  audio_message: " res/Audio/message.mp3",
  audio_camera: " res/Audio/camera.mp3",
  audio_bus: " res/Audio/bus.mp3"
}
var g_resources = [];
for (var i in res) {
  g_resources.push(res[i]);
}
var jf = {};
jf.EventName = {};
jf.EventName.GP_BUS = "GP_BUS";
jf.EventName.GP_BUS_OUT = "GP_BUS_OUT";
jf.EventName.GP_END = "GP_END";