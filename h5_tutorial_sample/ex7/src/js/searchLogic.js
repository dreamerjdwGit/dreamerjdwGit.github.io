(function() {
	
	// --- URL --- //
	var GET_BOOKLIST = 'bookData/';

	// 搜索栏Logic
	var searchLogic = {

		__name: 'searchLogic',

		// 按条件获取书本信息
		getBookListData: function(page, condition) {

			var url = GET_BOOKLIST;
			if(page < 10) {
				url = GET_BOOKLIST + "page00"+ page + ".json";
			} 

			if(page >= 10) {
				page = page % 10;
				if(page === 0 ) {
					url = GET_BOOKLIST + "page010.json";
				} else {
					url = GET_BOOKLIST + "page00"+ page + ".json";
				}
			}

			if(condition && condition === "小说") {
				url = GET_BOOKLIST + 'novel.json';
			}

			var dfd = this.deferred();

			var result = null;  
  
	        this._getBookData(url).done(function(data) {  
	            if(typeof data === 'object') {
	    			result = data;
				} else {
	    			result = JSON.parse(data);
				}
	            dfd.resolve(result);  
	        }).fail(function(error) {  
	            dfd.reject(error.message);  
	        });  
	  
	       return dfd.promise();
		},

		// ajax请求书本信息
		_getBookData: function(url) {
			var promise = h5.ajax(url, {
				type: 'GET',
				datatype: 'json'
			});
			return promise;
		},

		// 判断是否到底
		isAtBottom: function($el) {

			// 滚动条高度
			var scrollHeight = $el[0].scrollHeight;

			// 滚动条距离上部高度
			var scrollTop = $el[0].scrollTop;

			// 滚动区域高度
			var divHeight = $el[0].clientHeight;

			if(scrollTop + divHeight >= scrollHeight ) {
				return true;
			}

			return false;
		}
	};

	// グローバルに公開する
	h5.core.expose(searchLogic);

}) ();