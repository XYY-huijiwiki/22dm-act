var GameManager = {
  canTouch : false,
  speed : {min:0.9,max:3,multiple:2.5},
  wordspeed_f : 1,
  wordspeed_n : 1,
  wordspeed_s : 1,
  controller : {
    cassette:{
      zindex : 200,
      speed : 1.3,
      map_height : [0,1653,3307,4960],
      map_pic : 3,
      opacityspeed : 0.8,
      endopacity : 100
    },
    space:{
      zindex : 150,
      map_height : [0,1653,3307,4960],
      map_pic : 3,
      speed : 1.5,
      word_1speed : 5,
      word_2speed : 10,
      map_1speed : 2,
      carspeed : 0.45,
      stonespeed : 1.5,
      opacityspeed : 0.8,
      endopacity : 50
    },
    wolf_1:{
      zindex : 120,
      speed : 1.0,
      map_height : [1624,1700],
      lightscale : 2,
      handspeed : 0.75,
      opacityspeed : 0.8,
      endopacity : 50
    },
    wolf_2:{
      zindex : 115,
      speed : 0.9,
      opacityspeed : 1,
      endopacity : 50
    },
    wolf_3:{
      zindex : 110,
      speed : 1,
      mapscale : 2,
      smokescale : 2,
      speed : 0.8,
      opacityspeed : 1,
      endopacity : 80
    },
    wolf_4:{
      zindex : 105,
      speed : 1.2,
      mapscale : 1.3,
      tearscale : 0.5,
      tearendscale : 3.5,
      speed : 1.0,
      tear_1speed : 0.8,
      tear_2speed : 0.7,
      tear_2_dropspeed : 0.8,
      tear_2_scalespeed : 0.005
    },
    jonie:{
      zindex : 100,
      speed : 1.0,
      opacityspeed : 0.7,
      speed_run : 1.2,
      speed_jump1 : 1.1,
      speed_jump2 : 1.3,
      speed_role : 2,
      mapscale : 1.5,
      cloudscale : 1.2,
      windscle : 1.2,
      endopacity : 0
    },
    dead:{
      zindex : 95,
      speed : 1,
      opacityspeed : 0.8,
      endopacity : 0
    },
    bell:{
      zindex : 90,
      speed : 1.0,
      endopacity : 0,
      opacityspeed : 1,
      bell_1speed : 0.2,
      bell_2speed : 0.2,
      bell_3speed : 1.4,
      word_1speed : 1.5,
      word_2speed : 13,
      word_3speed : 7
    },
    pushclock:{
      zindex : 85,
      speed : 1.0,
      opacityspeed : 0.6,
      endopacity : 0
    },
    turnclock:{
      zindex : 80,
      speed : 1.0,
      endopacity : 0,
      turnspeed : 0.5,
      opacityspeed : 0.7
    }
  },
  getController : function(part){
    return this.controller[part];
  }
};