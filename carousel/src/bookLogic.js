(function() {
	
	// --- URL 検索書籍--- //
	var GET_BOOKLIST = 'booklist.json';

	/**
	 * 書籍ロジック
	 *
	 * @class
	 * @name bookLogic
	 */
	var bookLogic = {

		/**
		 * コントローラ名
		 *
		 * @memberOf JDWeb.book.BookController
		 * @type string
		 */
		__name: 'JDWeb.book.BookLogic',

		getBookListData: function() {

			var df = this.deferred();

			$.ajax({
				url: GET_BOOKLIST,
				datatype: 'json',
				success: function(data) {
					df.resolve(data);
				},
				error: function() {
					alert('書籍データの読み込みに失敗しました。');
				}
			});
			
			return df.promise();
		},

		makeCarouselElement: function($root, data) {
			var bookList = data;
			for(var i=0, len=bookList.length; i<len; i++) {
				var _$item =$('<div class="item"></div>');
				_$item.css({
					'background': 'url('+ bookList[i].cover_page_url + ')',
					'background-size': '100%',
					'float': 'left'
				});

				$root.append(_$item);
			}
		}
	};

	// グローバルに公開する
	h5.core.expose(bookLogic);

}) ();