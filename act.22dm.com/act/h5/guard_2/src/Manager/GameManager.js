// 游戏管理对象
var GameManager = {
	level : 1, //当前关卡
	levelSpeed : 1,
	currentRoleId : 1, //当前角色(喜美暖沸懒)
	currentWolfPool : [], //怪物池
	currentWolf : [], //场上怪物集合
	currentBullet : [], //场上子弹集合
	currentHp : 3, //当前血量
	currWolfId : 1, //怪物id
	cuerrBulletId : 1, //子弹id
	totalScore : 0, //总分数
	speed : 1,
	icetime : 30, //冰冻时间
	icespeed : 0.7,
	isIceing : false,
	isBombing : false,
	bosstimer : null,
	killboss : false,
	delayTime : {
		MM : {},
		GP : {dialogs:3},
		GS : {}
	},
	zIndexY : [[140,200,260,320],[800,700,600,500,400]],
	wolfSetting : {
		blood : [0,3,4,6,4,4,5,2,3,7], //怪物血量
		speed : [0,0.03,0.03,0.03,0.03,0.03,0.03,0.025,0.03,0.03], //怪物移动速度
		distance : [0,95,120,70,95,95,70,180,95,80], //怪物移动距离 
		rect : [0,[60,40],[30,20],[60,40],[40,40],[40,40],[40,40],[40,40],[40,40],[40,40]] //碰撞缩小比例
	},
	bullectSetting : {
		role_1 : {
			distance : 1400,
			speed : 1.2
		},
		role_2 : {
			distance : 1400,
			speed : 2
		},
		role_3 : {
			distance : 1400,
			speed : 2
		},
		role_4 : {
			distance : 1400,
			speed : 2
		},
		role_5 : {
			distance : 1400,
			speed : 2
		}
	},
	roleSetting: {
		role_1 :{
			maxRotation : 50,
			minStrength : 0.3,
			maxStrength : 0.6,
			isBulletThroung : false, 
			action : {
				length : [15,32],
				speed : 3
			}
		},
		role_2 :{
			maxRotation : 50,
			minStrength : 0.5,
			maxStrength : 1,
			isBulletThroung : true, 
			action : {
				length : [8,29],
				speed : 3
			}
		},
		role_3 :{
			maxRotation : 50,
			minStrength : 0.5,
			maxStrength : 1,
			isBulletThroung : false, 
			action : {
				length : [9,31],
				speed : 3 
			}
		},
		role_4 :{
			maxRotation : 50,
			minStrength : 0.5,
			maxStrength : 1,
			isBulletThroung : false, 
			action : {
				length : [6,32],
				speed : 3
			}
		},
		role_5 :{
			maxRotation : 50,
			minStrength : 0.5,
			maxStrength : 1,
			isBulletThroung : false, 
			action : {
				length : [24,32],
				speed : 3
			}
		}
	},
	iceSetting : {
		role_1_1 : {
			offsetX : [0,115,120,130,110,115,120,105,110,125],
			offsetY : [0,80,75,80,80,80,80,80,80,80],
			frames : {
				strength_1 : [2,0.1,0.4], //动画帧数;动画播放时间;冻结事件
				strength_2 : [6,0.2,1.2],
				strength_3 : [29,1,2]
			}
		},
		role_2_1 : {
			offsetX : [0,85,90,105,85,85,90,85,78,100],
			offsetY : [0,108,102,102,102,102,102,102,110,102],
			frames : {
				strength_1 : [9,0.3,0.5], 
				strength_2 : [22,0.7,1.2],
				strength_3 : [35,1,2]
			}
		},
		role_3_1 : {
			offsetX : [0,100,95,110,100,100,100,100,95,100],
			offsetY : [0,110,120,120,120,120,120,120,120,120],
			frames : {
				strength_1 : [1.3,.1,.5], 
				strength_2 : [1.8,.1,.5],
				strength_3 : [3,.1,.5]
			}
    },
    role_4_1 : {
			offsetX : [0,80,80,100,80,80,80,80,80,80],
			offsetY : [0,130,140,140,140,140,140,140,140,140],
			frames : {
				strength_1 : [1,.05,0.2], 
				strength_2 : [1.2,.05,0.2],
				strength_3 : [1.5,.05,0.2]
			}
    },
    role_5_1 : {
			offsetX : [0,80,80,100,70,70,90,70,70,90],
			offsetY : [0,80,80,80,80,80,80,80,80,80],
			frames : {
				strength_1 : [.7,.1,1], 
				strength_2 : [1.3,.1,2],
				strength_3 : [1.9,.1,3]
			}
		}
	},
	screenSetting :{
		forbiddenX : 300, //禁止线x坐标
		minWidth : 1136
	},
	levelSetting : [
		{
			name : "关卡1",
			min_level : 1,
			max_id : 3,
			min_speed : 3,
			max_speed : 4,
			count : 30
    },
    {
			name : "关卡2",
			min_level : 2,
			max_id : 4,
			min_speed : 2.9,
			max_speed : 4,
			count : 30
    },
    {
			name : "关卡3",
			min_level : 3,
			max_id : 5,
			min_speed : 2.8,
			max_speed : 4,
			count : 30
    },
    {
			name : "关卡4",
			min_level : 4,
			max_id : 6,
			min_speed : 2.7,
			max_speed : 4,
			count : 50
    },
    {
			name : "关卡5",
			min_level : 5,
			max_id : 7,
			min_speed : 2.6,
			max_speed : 3.8,
			count : 50
		},
    {
			name : "关卡5",
			min_level : 5,
			max_id : 7,
			min_speed : 2.5,
			max_speed : 3.7,
			count : 50
		},
    {
			name : "关卡6",
			min_level : 6,
			max_id : 8,
			min_speed : 2.5,
			max_speed : 3.5,
			count : 100
		},
    {
			name : "关卡7",
			min_level : 7,
			max_id : 9,
			min_speed : 2.3,
			max_speed : 3.5,
			count : 200
		}
	],
	getWolfSetting : function(data){
		var json = {
			id : this.currWolfId,
	    wid : data.wid,
			y : data.y,
			zIndex : data.z,
			active : "in",
      blood : this.wolfSetting.blood[data.wid],
      speed : this.wolfSetting.speed[data.wid]*this.levelSpeed,
      deltaX : this.wolfSetting.distance[data.wid]*this.levelSpeed,
      hurt : false,
      HP : []
		};
		this.currWolfId++;
		return json;
	},
	getBulletSetting : function(){
		var strength = 1;
		if(v_main.Game_strength >= this.roleSetting["role_"+this.currentRoleId].maxStrength*0.9)
			strength = 3;
    else if(v_main.Game_strength >= this.roleSetting["role_"+this.currentRoleId].maxStrength*0.6)
			strength = 2;
		var json = {
			id : this.cuerrBulletId,
			bomb : false,
			scale : strength==1?0.9:strength==2?1:1.2,
      strength : strength
		};
		this.cuerrBulletId++;
		return json;
	},
	createWolfPoor : function(){
		this.currentWolfPoor = [];
		var setting=null,dt,wid,y,z,r;
		var locationOffsetY = [0,-20,0,5,0,0,10,3,7,40];
		var pool = [];
		var levelSetting = this.levelSetting;
    var new_skill = Math.random()>0.5? 1 : 2;
    var bossindex = -1;
		for(var i=0;i<levelSetting.length;i++){
			if(this.level<=levelSetting[i].min_level){
				setting = levelSetting[i];
				console.log("关卡 "+this.level+"; "+setting.name);
				break;
			}
		}
		if(setting==null){
			setting = levelSetting[levelSetting.length-1];
			console.log("关卡 "+this.level+"; "+setting.name);
		}
		//for(var i=1;i<2;i++)
		for(var i=0;i<setting.count;i++)
		{
			dt = (Math.random()*(setting.min_speed-setting.max_speed)+setting.max_speed).toFixed(2)*1;
			wid = Math.ceil((Math.random()*setting.max_id));
			r = Math.ceil(Math.random()*this.zIndexY[0].length-1);
      r <= 0 ? 1 : r;
      //r = 1;
      //wid = 9;
      if(wid==9){
        if(bossindex==-1 || i>bossindex+20)
          bossindex = i;
        else
          wid = 1;
      }
			y = this.zIndexY[0][r]+locationOffsetY[wid];
			z = this.zIndexY[1][r];
			pool.push({dt:dt,wid:wid,y:y,z:z});
		}
    this.currentWolfPool = pool;
    var leveltext = {
			level:GameManager.level,
      count : setting.count,
      max_wid : setting.max_id,
      new_skill: new_skill
    } 
		this.onShowLevel(leveltext);
		//console.log(pool);
  },
  onShowLevel : function(leveltext){
    if(this.isIceing)
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_ICE_LAYER));
    v_main.leveltext = leveltext;
    leveltext.new_skill==1?v_main.Game_ice++:v_main.Game_bomb++;
    var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
    event.setUserData({
      callback:function(){
        v_main.scene="GamePlayScene";
        v_main.canPlay = true;
      }
    });
    cc.eventManager.dispatchEvent(event);
    v_main.scene='GameLevelScene';
		winSize.playEffect("next_level");
		
		// v_main.scene="GamePlayScene";
    // v_main.canPlay = true;
  },
	reset : function(){
		this.level=1;
		this.levelSpeed=1;
		this.currentWolf=[];
		this.currentBullet=[];
		this.currentWolfPoor = [];
		this.currWolfId=1;
		this.cuerrBulletId=1;
		this.currentHp=3;
		this.totalScore=0;
		this.isIceing=false;
		this.isBombing=false;
		clearInterval(this.bosstimer);
		this.bosstimer=null;
		this.killboss=false;
	},
	setWolfIce:function(isIceing){
		var speed = isIceing ? this.icespeed : 1;
		cc.director.getScheduler().setTimeScale(speed);
		this.isIceing = isIceing;
	},
	button : {
		mm_music : null,
		mm_start : null,
		mm_record : null,
		mm_rule : null,
		gp_ice : null,
		gp_bomb : null,
		gp_music : null,
		gp_pause : null,
		gp_tips : null,
		gs_home : null,
		gs_share : null,
		gs_record : null,
		gs_lottery : null
	},
	setButton : function(setting){
		if(setting){
			$("#"+setting.name).css({
				width : setting.w,
				height : setting.h,
				top : 640-setting.y-setting.h/2,
				left : setting.x-setting.w/2
			});
		}
	}
};