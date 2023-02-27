// 游戏管理对象
var GameManager = {
	currLevel           : 20,
	currScore           : 0,
	currSkill           : 20,
    currArticlePool     : [],
	currArticleTarget   : [],
	currArticleTargetTotal : 0,
	currArticleSequence : [],
	currTimer : null,
	currTimerText : null,
	isGameOver : false,
	reset : function(){
		winSize.ArtSequence = [];
		winSize.ArtInterfere = [];
		winSize.ArtInterfere = [1,2,11,15,16,17,18,19,20,22,24,28,37,38];
		for(var i=1;i<=39;i++){
			winSize.ArtSequence.push(i);
		}
		GameManager.currArticlePool = [];
        GameManager.currArticleTarget = [];
        GameManager.currArticleSequence = [];
        GameManager.currArticleTargetTotal = 0;
        GameManager.currTimer = null;
        GameManager.currTimerText = null;
        GameManager.isGameOver = false;
	},
	restart : function(){
		GameManager.currLevel = 0;
		GameManager.currSkill = 3;
		GameManager.currScore  = 0;
	}
};

var GP_TMX =[
[
    [
        {
            "x": 929,
            "y": 16
        },
        {
            "x": 768,
            "y": 43
        },
        {
            "x": 597,
            "y": 13
        },
        {
            "x": 451,
            "y": 49
        },
        {
            "x": 308,
            "y": 3
        },
        {
            "x": 157,
            "y": 32
        },
        {
            "x": 2,
            "y": 6
        }
    ],
    [
        {
            "x": 1109,
            "y": 16
        },
        {
            "x": 921,
            "y": 169
        },
        {
            "x": 707,
            "y": 193
        },
        {
            "x": 548,
            "y": 191
        },
        {
            "x": 359,
            "y": 200
        },
        {
            "x": 201,
            "y": 180
        },
        {
            "x": 17,
            "y": 178
        }
    ],
    [
        {
            "x": 1320,
            "y": 16
        },
        {
            "x": 953,
            "y": 325
        },
        {
            "x": 755,
            "y": 343
        },
        {
            "x": 587,
            "y": 349
        },
        {
            "x": 231,
            "y": 349
        },
        {
            "x": 1421,
            "y": 159
        },
        {
            "x": 76,
            "y": 325
        }
    ],
    [
        {
            "x": 1137,
            "y": 169
        },
        {
            "x": 1123,
            "y": 325
        },
        {
            "x": 1283,
            "y": 243
        },
        {
            "x": 384,
            "y": 573
        },
        {
            "x": 205,
            "y": 491
        },
        {
            "x": 432,
            "y": 400
        },
        {
            "x": 13,
            "y": 479
        }
    ],
    [
        {
            "x": 925,
            "y": 641
        },
        {
            "x": 872,
            "y": 483
        },
        {
            "x": 747,
            "y": 647
        },
        {
            "x": 697,
            "y": 507
        },
        {
            "x": 540,
            "y": 628
        },
        {
            "x": 196,
            "y": 644
        },
        {
            "x": 28,
            "y": 628
        }
    ],
    [
        {
            "x": 1425,
            "y": 645
        },
        {
            "x": 1260,
            "y": 636
        },
        {
            "x": 1077,
            "y": 613
        },
        {
            "x": 1036,
            "y": 468
        },
        {
            "x": 1239,
            "y": 468
        },
        {
            "x": 1425,
            "y": 341
        },
        {
            "x": 1397,
            "y": 489
        }
    ]
],
[
	  	[
	        {
	            "x": 1425,
	            "y": 645
	        },
	        {
	            "x": 1260,
	            "y": 636
	        },
	        {
	            "x": 1077,
	            "y": 613
	        },
	        {
	            "x": 1036,
	            "y": 468
	        },
	        {
	            "x": 1239,
	            "y": 468
	        },
	        {
	            "x": 1425,
	            "y": 341
	        },
	        {
	            "x": 1397,
	            "y": 489
	        }
	    ],
	    [
	        {
	            "x": 925,
	            "y": 641
	        },
	        {
	            "x": 872,
	            "y": 483
	        },
	        {
	            "x": 747,
	            "y": 647
	        },
	        {
	            "x": 697,
	            "y": 507
	        },
	        {
	            "x": 540,
	            "y": 628
	        },
	        {
	            "x": 196,
	            "y": 644
	        },
	        {
	            "x": 28,
	            "y": 628
	        }
	    ],
	    [
	        {
	            "x": 1137,
	            "y": 169
	        },
	        {
	            "x": 1123,
	            "y": 325
	        },
	        {
	            "x": 1283,
	            "y": 243
	        },
	        {
	            "x": 384,
	            "y": 573
	        },
	        {
	            "x": 205,
	            "y": 491
	        },
	        {
	            "x": 432,
	            "y": 400
	        },
	        {
	            "x": 13,
	            "y": 479
	        }
	    ],
	    [
	        {
	            "x": 1320,
	            "y": 16
	        },
	        {
	            "x": 953,
	            "y": 325
	        },
	        {
	            "x": 755,
	            "y": 343
	        },
	        {
	            "x": 587,
	            "y": 349
	        },
	        {
	            "x": 231,
	            "y": 349
	        },
	        {
	            "x": 1421,
	            "y": 159
	        },
	        {
	            "x": 76,
	            "y": 325
	        }
	    ],
	    [
	        {
	            "x": 1109,
	            "y": 16
	        },
	        {
	            "x": 921,
	            "y": 169
	        },
	        {
	            "x": 707,
	            "y": 193
	        },
	        {
	            "x": 548,
	            "y": 191
	        },
	        {
	            "x": 359,
	            "y": 200
	        },
	        {
	            "x": 201,
	            "y": 180
	        },
	        {
	            "x": 17,
	            "y": 178
	        }
	    ],
	    [
	        {
	            "x": 929,
	            "y": 16
	        },
	        {
	            "x": 768,
	            "y": 43
	        },
	        {
	            "x": 597,
	            "y": 13
	        },
	        {
	            "x": 451,
	            "y": 49
	        },
	        {
	            "x": 308,
	            "y": 3
	        },
	        {
	            "x": 157,
	            "y": 32
	        },
	        {
	            "x": 2,
	            "y": 6
	        }
	    ]
    ]
]