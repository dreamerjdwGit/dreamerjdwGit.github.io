(function() {

	// MovieManager的生成
	var movieManager = h5.core.data.createManager('MovieManager');

	// MovieModel的生成
	var movieModel = movieManager.createModel({

		// name
		name: 'MovieModel',

		// schema
		schema: {
			// ID
			id: {
				id: true,
				type: 'string'
			},
			alt: {
				type: 'string'
			},
			casts: {
				type: 'any[]'
			},
			collect_count: {
				type: 'integer'
			},
			directors: {
				type: 'any[]'
			},
			genres: {
				type: 'any[]'
			},

			// movieName
			title: {
				type: 'string'
			},
			// movieImage
			images: {
				type: 'any'
			},
			original_title: {
				type: 'string'
			},
			// rating
			rating: {
				type: 'any'
			},
			subtype: {
				type: 'string'
			},
			year: {
				type: 'string'
			}
		}
	});

	// 设置为全局变量
	h5.u.obj.expose('app.movie', {
		MovieModel: movieModel
	});

})();