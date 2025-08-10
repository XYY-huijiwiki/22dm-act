var v_main=null;
$(function(){
	v_main = new Vue({
		el   : '#all',
		data : {
			el : 'all'
		}
	});
	var swiper_banner = new Swiper ('#swiper-banner', {
		initialSlide : 0,
		direction : 'horizontal',
		speed : 500,
		autoplay: {
			delay : 3000,
		},
		effect : 'fade',
		pagination: {
			el: '#swiper-banner-pagination',
			clickable : true
		},
		navigation: {
			nextEl: '#swiper-banner-next',
			prevEl: '#swiper-banner-prev'
		}
	})  
	var swiper_subject = new Swiper('#swiper-subject', {
		slidesPerView: 8,
		navigation: {
			nextEl: '#swiper-subject-next',
			prevEl: '#swiper-subject-prev'
		}
	});

	$('#subject .swiper-slide a').hover(function () {
		if ($(this).find('img:animated').length) 
			return;
		$(this).animate({ marginTop: '-18px' }, 300);
		$(this).find('img').animate({ height: '110px' }, 300);
	}, function () {
		$(this).animate({ marginTop: '0px' }, 200);
		$(this).find('img').animate({ height: '100px' }, 200);
	});
})