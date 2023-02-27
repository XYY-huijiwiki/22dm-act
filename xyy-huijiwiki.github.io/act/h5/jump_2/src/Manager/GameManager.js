// 游戏管理对象
var GameManager = {
	btn : {
		start   : null,
		rule    : null,
		record  : null
	},
	hasRole : false,
	jump_direction : 0,
	maxRotation : 4,
	speedX1 : 8,
	speedX2 : 6.2,
	speedX3 : 4.4,
	speedY1 : 8,
	speedY2 : 7.3,
	speedY3 : 6.6,
	speed : 0.4,
	deltaY : 350,
	deltaX : 150,
	mult_1 : 1,
	mult_2 : 1.25,
	currentRope : [],
	reset : function(){
		this.hasRole = false;
		this.currentRope=[];
	}
};