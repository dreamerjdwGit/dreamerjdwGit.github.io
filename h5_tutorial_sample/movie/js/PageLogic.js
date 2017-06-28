(function(){

	// 热门电影API
	var HOT_MOVIE_PATH = 'https://api.douban.com/v2/movie/in_theaters';

	// 近期热门电影API
	var NEW_MOVIE_PATH = 'https://api.douban.com/v2/movie/coming_soon';

	// top电影API
	var TOP_MOVIE_PATH = 'https://api.douban.com/v2/movie/top250';

	var apiPath = {
		'hotMovies': HOT_MOVIE_PATH,
		'newMovies': NEW_MOVIE_PATH,
		'topMovies': TOP_MOVIE_PATH
	};

	// MovieLogic
	var movieLogic = {

		// name
		__name: 'app.movie.MovieLogic',

		// count
		count: 5,

		// MovieModel
		model: app.movie.MovieModel,

		// 热门电影用ObservableArray
		hotMovies: h5.core.data.createObservableArray(),

		// 近期上映用ObservableArray
		newMovies: h5.core.data.createObservableArray(),

		// top电影用ObservableArray
		topMovies: h5.core.data.createObservableArray(),

		// 根据参数，获取电影信息
		getMovies: function(option) {

			var num = this[option].length + this.count;
			
			// url
			var url = apiPath[option] + '?count=' + num;

			// jsonp请求数据
			var promise = this.getData(url);

			// 返回promise
			return promise;
		},

		// jsonp请求获取数据
		getData: function(url) {
			var df = this.deferred();
			var _self = this;

			// jsonp
			h5.ajax({
				methods: 'GET',
				dataType: 'jsonp',
				jsonp:'callback',
				url: url,
				success: function(data) {
					var dataItems = _self.model.create(data.subjects);
					df.resolve(dataItems);
				},
				error: function() {
					alert('无法从豆瓣API获取数据')
				}
			});

			return df.promise();
		},

		// 设置相关ObservableArray
		setObservableArray: function(option, data) {
			this[option].copyFrom(data);
		},

		// 获取相关ObservableArray
		getObservableArray: function(option) {
			return this[option];
		}
	};

	// 设置为全局变量
	h5.core.expose(movieLogic);

})();