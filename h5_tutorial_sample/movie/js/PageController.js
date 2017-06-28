(function() {

	// 各电影模块dom名
	var views = {
		'0': 'hot-movie',
		'1': 'new-movie',
		'2': 'top-movie'
	};

	// PageController
	var pageController = {

		// name
		__name: 'app.controller.PageController',

		// pageLogic
		pageLogic: app.movie.MovieLogic,

		// 初始化
		__ready: function() {

			var _self = this;

			// 隐藏
			$('.movieList').hide();
			$('.loadMore').hide();
			$('.backTop').hide();

			// 数据初始化
			var promise = this.pageLogic.getMovies('hotMovies');

			// 将数据绑定到视图
			promise.done(function(data) {

				$('.movieList').show();
				$('.loadMore').show();
				$('.loader').hide();

				// 设定数据到相应数组
				_self.pageLogic.setObservableArray('hotMovies', data);

				// 热门电影数据获取
				var items = _self.pageLogic.getObservableArray('hotMovies');

				// 视图绑定更新
				h5.core.view.bind($('.hot-movie'), {
				    items: items
				});

			});
		},

		// 获取电影选项
		getOption: function(num) {
			var option = '';
			switch(num) {
				case 0: option = 'hotMovies';break;
				case 1: option = 'newMovies';break;
				case 2: option = 'topMovies';break;
				default: return;
			}
			return option;
		},

		// 转换视图
		switchView: function(from, to) {

			if(from === to) {
				return;
			}

			var option = this.getOption(to);
			
			// 判断当前列表是否为空，为空时获取数据绑定视图
			var dataSize = this.pageLogic.getObservableArray(option).length;

			if(dataSize === 0) {

				var selector = '.' + views[to];

				// show
				$(selector).find('.movieList').hide();
				$(selector).find('.loadMore').hide();
				$(selector).find('.loader').show();

				// 获取数据，视图绑定
				var promise = this.pageLogic.getMovies(option);

				var _self = this;

				// 将数据绑定到视图
				promise.done(function(data) {

					// 隐藏
					$(selector).find('.movieList').show();
					$(selector).find('.loadMore').show();
					$(selector).find('.loader').hide();

					// 设定数据到相应数组
					_self.pageLogic.setObservableArray(option, data);

					// 数据获取
					var items = _self.pageLogic.getObservableArray(option);

					// 视图绑定更新
					h5.core.view.bind($(selector), {
					    items: items
					});

				});
			}

			// 内容切换移动方向
			var direction = 1;
			if(from < to) {
				direction = 0;
			}

			var $from = $('.' + views[from]);
			var $to = $('.' + views[to]);

			// 模块移动
			this.viewTransition($from, $to, direction);
		},

		// 模块移动
		viewTransition: function($from, $to, direction) {

			// 模块移出
			$from.animate({
				left: '-100rem'
			}, 1500);

			// 模块移入			
			$to.animate({
				left: '50%'
			}, 1500);
		},

		// 导航栏点击事件
		'{.nav-movie} click': function(context, $el) {

			// 选中标签样式调整
			var from = Array.prototype.indexOf.call($('li'), $('.selected')[0]);
			$('li').removeClass('selected');
			var $selected = $(context.event.target);
			$selected.addClass('selected');

			var to = Array.prototype.indexOf.call($('li'), context.event.target);

			// 绑定内容更新
			this.switchView(from, to);
		},

		// 加载更多
		'.loadMore click': function(context, $el) {

			var id = Number($el.data('id'));

			var $loader = $el.parent().find('.loader');

			var _self = this;

			// 加载图标显示
			$el.hide();
			$loader.show();

			var option = this.getOption(id);

			// 获取数据，更新数据
			var promise = this.pageLogic.getMovies(option);

			promise.then(function(data){
				_self.pageLogic.setObservableArray(option, data);
				$loader.hide();
				$el.show();
			});
		},

		// 返回顶部
		'{.backTop} click': function() {
			$('body').animate({"scrollTop": 0}, 1000);
		},

		// 滚动条滚动事件
		'{window} scroll': function(context, $el) {
			if ($(document).scrollTop() > 600) {
		    	$(".backTop").fadeIn(500);
		    } else {
		    	$(".backTop").fadeOut(500);
		    }
		}
	};

	// Controller化
	h5.core.controller('.wrapper', pageController);

})();