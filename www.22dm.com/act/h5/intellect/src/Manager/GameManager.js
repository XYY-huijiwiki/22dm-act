// 游戏管理对象
var GameManager = {
	touch         : true,
	currScore     : null,
	currTimer     : null,
	currTimerText : null,
	reset : function(){	
    	userInfo.balllterid = null;
		winSize.SubjectList=[];
		v_main.isGameOver=false;
		v_main.isbattle=false;
		v_main.user_one.gold=0;
		v_main.user_two.gold=0;
		v_main.user_one.combo=[];
		v_main.user_two.combo=[];
		var mover = $(".score_inner").css("top","85%");
	}
};