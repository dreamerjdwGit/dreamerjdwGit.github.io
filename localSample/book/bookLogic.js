(function() {
	
	// --- URL 検索書籍--- //
	var GET_BOOKLIST = '../bookData/page';

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

		getBookListData: function(pageSize, page, condition) {

			var url = GET_BOOKLIST;
			if(page < 10) {
				url = GET_BOOKLIST + "00"+ page + ".json";
			} 

			if(page >= 10) {
				page = page % 10;
				if(page === 0 ) {
					url = GET_BOOKLIST + "010.json";
				} else {
					url = GET_BOOKLIST + "00"+ page + ".json";
				}
			}

			var df = this.deferred();

			$.ajax({
				url: url,
				datatype: 'json',
				success: function(data) {
					df.resolve(data);
				},
				error: function() {
					var errorMessage = '書籍データの読み込みに失敗しました。';
					df.reject(errorMessage);
				}
			});
			
			return df.promise();
		}
	};

	// グローバルに公開する
	h5.core.expose(bookLogic);

}) ();