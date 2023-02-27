// 游戏管理对象
var GameManager = {
	btn : {
		start   : null,
		rule    : null,
		record  : null
	},
	speed : 0.4,
	deltaY : 300,
	deltaX : 100,
	mult_1 : 1,
	mult_2 : 1.3,
	currentRope : [],
	reset : function(){
		this.currentRope=[];
	}
};