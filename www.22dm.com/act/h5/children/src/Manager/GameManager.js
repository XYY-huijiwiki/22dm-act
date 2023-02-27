// 游戏管理对象
var GameManager = {
	totalScore     : 0,
	targetScore    : 0,
	isGameOver     : false,
	isSkilling     : false,
	currHammerPool : [],
	currRolePool   : [],
	currEmptyHole  : [1,2,3,4,5,6],
	isCombo        : 0,
	rolePos : [
		{
			name: 'mouse_0', 
			up  : 140,
			pos : [150,470,305,450,620]  
		},
		{
			name: 'bomb_0', 
			up  : 140,
			pos : [155,475,270,430,590]  
		},
		{
			name: 'xi_0', 
			up  : 160,
			pos : [165,485,295,450,605]  
		},
		{
			name: 'mei_0', 
			up  : 150,
			pos : [165,490,300,455,610]  
		},
		{
			name: 'wolf_0', 
			up  : 150,
			pos : [165,485,260,410,570]  
		},
		{
			name: 'role_ice', 
			up  : 150,
			pos : [165,485,260,410,570]  
		},
		{
			name: 'role_bomb', 
			up  : 150,
			pos : [165,485,260,410,570]  
		}
	],
	roleIndex : [35,25,15],
	holeBox   : [[60,250,400,580],[340,450,610,760]],
	reset : function(){
		clearInterval(timer_add);
        v_main.isHammer = false;
		this.isGameOver = false;
		this.isSkilling = false;
		this.isCombo = 0;
		this.currHammerPool = [];
		this.currRolePool = [];
		this.currEmptyHole = [1,2,3,4,5,6];
		if(v_main.Game_level<5){
			this.targetScore = 30;
		}
		else if(v_main.Game_level<10){
			this.targetScore = 50;
		}
		else if(v_main.Game_level<15){
			this.targetScore = 80;
		}
		else if(v_main.Game_level<20){
			this.targetScore = 120;
		}
		else if(v_main.Game_level<30){
			this.targetScore = 150;
		}
		else if(v_main.Game_level<40){
			this.targetScore = 180;
		}
		else if(v_main.Game_level<50){
			this.targetScore = 210;
		}
		else{
			this.targetScore = 300;
		}
	}
};