// 游戏管理对象
var GameManager = {
	level : 1, //当前关卡
	levelSpeed : 1,
	currentRoleId : 1, //当前角色 1:喜羊羊 2:美羊羊
	currentWolfPool : [], //怪物池
	currentWolf : [], //场上怪物集合
	currentBullet : [], //场上子弹集合
	currentHp : 3, //当前血量
	currWolfId : 1, //怪物id
	cuerrBulletId : 1, //子弹id
	totalScore : 0, //总分数
	wolfSetting : {
		blood : [0,3,4,6], //怪物血量
		speed : [0,0.03,0.03,0.03], //怪物移动速度
		distance : [0,100,125,70], //怪物移动距离 
		rect : [0,[40,40],[40,40],[40,40]] //碰撞缩小比例
	},
	bullectSetting : {
		role_1 : {
			distance : 1400, //子弹飞行距离
			speed : 0.9 //子弹最快速度
		},
		role_2 : {
			distance : 1400, //子弹飞行距离
			speed : 1.5 //子弹最快速度
		}
	},
	roleSetting: {
		role_1 :{
			maxRotation : 50, //人物最大角度
			maxStrength : 0.7, //蓄力100%所需时间
			isBulletThroung : false, 
			action : {
				length : [15,32], //角色蓄力/发射动画帧数
				speed : 3 //一个循环走动的速度
			}
		},
		role_2 :{
			maxRotation : 50, //人物最大角度
			maxStrength : 2, //蓄力100%所需时间
			isBulletThroung : true, 
			action : {
				length : [8,29], //角色蓄力/发射动画帧数
				speed : 3 //一个循环走动的速度
			}
		}
	},
	iceSetting : {
		role_1_1 : {
			offsetX : [0,125,125,135],
			offsetY : [0,80,75,80],
			frames : {
				strength_1 : [2,0.1,0.4], //动画帧数;动画播放时间;延迟消失时间
				strength_2 : [6,0.2,1.2],
				strength_3 : [29,1,2]
			}
		},
		role_2_1 : {
			offsetX : [0,90,90,105],
			offsetY : [0,108,102,102],
			frames : {
				strength_1 : [22,0.5,0.5], //动画帧数;动画播放时间;延迟消失时间
				strength_2 : [35,0.7,1.0]
			}
		},
		role_2_2 : {
			offsetX : [0,85,90,110],
			offsetY : [0,100,98,98],
			frames : {
				strength_3 : [28,1,2]
			}
		}
	},
	screenSetting :{
		forbiddenX : 400, //禁止线x坐标
		minWidth : 1136
	},
	levelSetting : [
		{
			name : "难度1",
			min_level : 1,
			max_id : 1,
			min_speed : 3.2,
			max_speed : 2.5,
			count : 30,
			tips : {
				tid : 1,
				did : 1,
				rid : 1
			}
		},
		{
			name : "难度2",
			min_level : 2,
			max_id : 2,
			min_speed : 3.2,
			max_speed : 2.3,
			count : 50,
			tips : {
				tid : 1,
				did : 2,
				rid : 2
			}
		},
		{
			name : "难度3",
			min_level : 3,
			max_id : 3,
			min_speed : 3.2,
			max_speed : 2.1,
			count : 100,
			tips : {
				tid : 1,
				did : 2,
				rid : 3
			}
		}
	],
	getWolfSetting : function(data){
		var json = {
			id : this.currWolfId,
	        wid : data.wid,
			y : data.y,
			zIndex : data.z,
			active : "in",
	        empty : true,
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
			scale : strength==1?0.75:strength==2?1.2:1.8,
      strength : strength
		};
		this.cuerrBulletId++;
		return json;
	},
	createWolfPoor : function(){
		this.currentWolfPoor = [];
		var tips = false;
		var setting=null,dt,wid,y,z,r;
		var locationY = [[120,200,280],[300,200,100]];
		var pool = [];
		for(var i=0;i<this.levelSetting.length;i++){
			if(this.level<=this.levelSetting[i].min_level){
				if(this.level==this.levelSetting[i].min_level && this.level!=1){
					v_main.tips = this.levelSetting[i].tips;
					tips = true;
				}
				setting = this.levelSetting[i];
				console.log("关卡 "+this.level+"; "+setting.name);
				break;
			}
		}
		if(setting==null){
			setting = this.levelSetting[this.levelSetting.length-1];
			console.log("关卡 "+this.level+"; "+setting.name);
		}
		for(var i=0;i<setting.count;i++){
			dt = (Math.random()*(setting.min_speed-setting.max_speed)+setting.max_speed).toFixed(2)*1;
			wid = Math.ceil((Math.random()*setting.max_id));
			wid == 0 ? 1 : wid;
			r = Math.ceil(Math.random()*2);
			r == 0 ? 1 : r;
			y = locationY[0][r];
			z = locationY[1][r];
			pool.push({dt:dt,wid:wid,y:y,z:z});
		}
		//console.log(pool);
		this.currentWolfPool = pool;
		if(tips){
			v_main.active = "tips";
			return;
		}
		v_main.canPlay = true;
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
	},
	button : {
		mm_music : null,
		mm_start : null,
		mm_record : null,
		mm_rule : null,
		gp_music : null,
		gp_pause : null,
		gs_home : null,
		gs_share : null,
		gs_record : null
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