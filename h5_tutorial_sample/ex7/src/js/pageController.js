$(function(){

	// 页面pageController
	var pageController = {

		// name
		__name: 'pageController',

		// 搜索一览Controlelr
		_searchController: searchController,

		// 详细一览Controlelr
		_detailController: detailController,

		// 购物车Controlelr
		_cartController: shoppingCartController,

		__ready: function() {
			// 页面初始化
			this.init();
		},

		// 页面初始化
		init: function() {

			// 书籍搜索一览初始化
			this._searchController.init();
		}

	};

	h5.core.controller('#container', pageController);
});