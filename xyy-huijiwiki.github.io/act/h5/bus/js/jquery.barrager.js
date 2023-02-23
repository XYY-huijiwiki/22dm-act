(function($) {
    $.fn.barrager = function (barrage, index, isLoop) {
		barrage = $.extend({
			top: -1,
			speed: 15,
			color: '#fff'
		}, barrage || {});
		var barrager_id = 'barrage_' + index;
		var id = '#' + barrager_id;
		var div_barrager = $("<div class='barrage' id='" + barrager_id + "' ></div>").appendTo($(this));
		var this_width =  this.width();
		var this_height =  this.height();
		var top = (barrage.top == -1) ? Math.floor(Math.random() * 400) : barrage.top;
		div_barrager.css({
			"top":top + "px",
			"right":-div_barrager.width()
		});
		//z console.info("top:"+top);
		div_barrager_box = $("<div class='barrage_box cl' onclick='control.barrager.good(" + index + ")'></div>").appendTo(div_barrager);
		if(barrage.img){
			div_barrager_box.append("<a class='portrait z'></a>");
			var img = $("<img src='' >").appendTo(id + " .barrage_box .portrait");
			img.attr('src', barrage.img);
		}
		div_barrager_box.append(" <div class='z p'></div>");
		var content = $("<a></a>").appendTo(id + " .barrage_box .p");
		content.attr({
			'id': barrage.id
		}).empty().append(barrage.info);
		var good = true;
		for (var i = 0; i < control.goodClick.length; i++) {
		    if (control.goodClick[i] == index) {
		        good = false;
		    }
		}
		div_barrager_box.append(good == true ? '<a class="b_good"></a>' : '<a class="b_good b_good_ed"></a>');
		content.css('color', barrage.color);
		var i = 0;
		div_barrager.css('margin-right', 0);
		//¶¯»­
		$(id).stop().animate({ right: 1008 }, barrage.speed * 1000, function () {
		    $(id).unbind().remove();
		    if (isLoop) {
		        barrageInit();//Ñ­»·
		    }
		});
	}
	$.fn.barrager.removeAll=function(){
		 $('.barrage').remove();
	}
})(jQuery);
