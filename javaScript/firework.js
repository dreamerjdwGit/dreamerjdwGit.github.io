(function() {


	firework();

	// 烟花生成函数
	function firework() {

		// 鼠标点击事件响应
		document.onclick =function(e) {
			var oevent = e || event;

			var oreddiv = $("<div></div>");

			var top = document.documentElement.clientHeight;

			oreddiv.css({
				background: "red",
				width: "8px",
				height: "8px",
				borderRadius: "50%",
				left: oevent.clientX + "px",
				top: top + "px"
			});

			oreddiv.addClass('firework');

			$('body').append(oreddiv);

			var t = oevent.clientY;
			var l = oevent.clientX;

			var timer = setInterval(function() {

				var tempTop = oreddiv.offset().top;
				oreddiv.css('top',tempTop - 20 + "px");

				if(tempTop <= t) {
					clearInterval(timer);
					oreddiv.remove();
					var adiv = [];
					for(var i=0;i<50;i++) {
						odiv = $('<div></div>');
						odiv.css({
							width: '2px',
							height: '2px',
							borderRadius: '50%',
							background: '#' + fillzero(),
							left: l + 'px',
							top: t + 'px'
						});

						odiv.addClass('firework');

						$('body').append(odiv);
						adiv.push(odiv);
						odiv.speedX = Math.random()*40-20;
						odiv.speedY = Math.random()*40-20;
					}

					var newtimer = setInterval(function(){
						for(var i=0;i<adiv.length;i++) {
							if(!adiv[i])
								continue;
							adiv[i].css({
								left: adiv[i].offset().left + adiv[i].speedX + "px",
								top: adiv[i].offset().top + adiv[i].speedY + "px"
							});
							adiv[i].speedY ++ ;
							if(adiv[i].offset().left<=0 ||
								adiv.offsetLeft>document.documentElement.clientWidth||
								adiv[i].offset().top>document.documentElement.clientHeight) {
								adiv[i].remove();
								adiv[i] = null;
							}
						}
					}, 30);
				}


			} ,30);
		};
	}

	function fillzero() {
		var strNum = Math.ceil(Math.random()*0xffffff).toString(16);
		if(strNum.length<6) {
			strNum='0'+strNum;
		}
		return strNum;
	}
})();