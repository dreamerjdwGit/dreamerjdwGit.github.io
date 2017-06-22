(function(){

	// 搜索一览栏controller
	var searchController = {

		// name
		__name: 'searchController',

		// searchLogic
		_searchLogic: searchLogic,

		// template
		__templates: 'view/bookList.ejs',

		// data
		bookData: [],

		// page
		page: 1,

		// id
		index: 0,

		// 书籍一览初始化
		init: function() {

			var _self = this;

			// 获取书籍信息
			this._searchLogic.getBookListData(this.page).done(function(data){
				// 根据书籍信息刷新结果一览
				_self.updateList(data.list);

				// 相关全局变量更新
				_self.page++;
				_self.index += data.list.length;
				_self.bookData = data.list;
			});
		},

		// 刷新结果一览
		updateList: function(list) {
			this.view.update('#bookList', 'bookList', {
				list: list,
				index: this.index
			})
		},

		// 结果一览插入新加载数据
		appendList: function(list) {
			this.view.append('#bookList', 'bookList', {
				list: list,
				index: this.index
			})
		},

		// 种类搜索
		'#category blur': function() {
			var value = this.$find('#category').val();
			var _self = this;
			if(value) {
				this._searchLogic.getBookListData(0, value).done(function(data){

					// 相关全局变量更新
					_self.page = 1;
					_self.index = 0;
					_self.bookData = data.list;

					// 根据书籍信息刷新结果一览
					_self.updateList(data.list);
				});
			}
		},

		// 滚动条动态加载
		'.result [scroll]': function(context, $el) {

			var _self = this;

			// 滚动条到底时
			if(this._searchLogic.isAtBottom($el)) {
				// 获取书籍信息
				this._searchLogic.getBookListData(this.page).done(function(data){
					// 根据书籍信息刷新结果一览
					_self.appendList(data.list);

					// 相关全局变量更新
					_self.page++;
					_self.index += data.list.length;
					_self.bookData = _self.bookData.concat(data.list);
				});
			}
		},

		// 选中书名，触发详细信息显示事件
		'.book click': function(context, $el) {
			this.$find('p.book').removeClass('bookSelected');
			$el.addClass('bookSelected');
			var a = $el.data('id');
			this.trigger('showDetail', this.bookData[$el.data('id')]);
			this.trigger('back');
		},

	};

	// グローバルに公開する
	h5.core.expose(searchController);
})();
