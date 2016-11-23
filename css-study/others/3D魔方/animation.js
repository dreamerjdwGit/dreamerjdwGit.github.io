(function() {
	var container = $('.container');
	var side = $('.side');

	side.mouseover(function(e) {
		container.css('animation-play-state', 'paused');
	});

	side.mouseout(function(e) {
		container.css('animation-play-state', 'running');
	});

	var x = 0,y = 0,z = 0;   
    var xx = 0,yy = 0;   
	var xArr = [],
		yArr = [];

	side.mousedown(function(e) {
		xArr[0] = e.clientX/2;
		yArr[0] = e.clientY/2;

		side.mousemove(function(e) {
			xArr[1] = e.clientX/2;//获取鼠标移动时第一个点的坐标   
                yArr[1] = e.clientY/2;   
                yy += xArr[1] - xArr[0];//获得鼠标移动的距离   
                xx += yArr[1] - yArr[0];   

                //将旋转角度写入transform中   
                container.css('transform', 'rotatex("+xx+"deg) rotatey("+yy+"deg) rotatez(0deg)scale3d(0.7,0.7,0.7)');
                xArr[0] = e.clientX/2;   
                yArr[0] = e.clientY/2;   
		});

		side.mouseup(function(e) {
			side.mousemove(null);  
		});
	});


})();