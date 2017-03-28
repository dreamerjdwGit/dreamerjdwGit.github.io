(function($) {

	// strictモード
	'use strict';

	// 非同期処理コントロール用
	var asyFunQueue = {

		state: 'normal',

		timerID: null,

		excuteFun: function(caller, func, args) {

			if(this.state == 'normal') {

				this.state = 'waiting';
				this._setTimer(caller, func, args);
				return;
			}

			if(this.state == 'waiting') {
				clearTimeout(this.timerID);
				this._setTimer(caller, func, args);
			}
		},

		_setTimer: function(caller, func, args) {
			this.timerID = setTimeout(function(){
				func.call(caller, args);
				this.state = 'normal';
			}, 500);
		}
	};

	/**
	 * 書籍画面コントローラ
	 *
	 * @class
	 * @name JDWeb.book.BookController
	 */
	var bookController = {

		// コントローラ名前
		__name: 'JDWeb.book.BookController',

		// カルーセルコントローラ		
		_carouselController: h5.ui.components.carousel.CarouselController,

		// スクロールコントローラ
		_scrollBarController: h5.ui.components.scroll.scrollBarController,

		// 書籍ロジック
		_bookLogic: JDWeb.book.BookLogic,

		// パラメータ
		__meta: {
			_carouselController: {
				rootElement: '.carousel-wrapper'
			},
			_scrollBarController: {
				rootElement: '#result'
			}
		},

		asyFunQueue: asyFunQueue,

		// 一覧templates
		__templates: 'list.ejs',

		// データ取得数
		_pageSize: 100,

		// 今のページ
		_page: 1,

		// データ格納
		_list: [],

		// データ数
		_listSize: null,

		// 一覧テーブル表示
		_showList: [],

		// カルーセル表示
		_carouselList: [],

		// スクロール範囲
		_scrollHeight: null,

		// マウス位置Y
		_scrollStartMousePosY: null,

		// スクロールバーの位置
		_scrollAreaTop: null,

		// カルーセルのデータローディング
		_isLoading: false,

		// カルーセル先頭ID
		_firstID: null,

		// カルーセル最後ID
		_lastID: null,

		// 検索条件
		_searchCondition: null,

		// セレクトのアイテム
		seletedItemID: null,

		// --- private Property --- //
		/**
		 * 初期処理
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		__ready: function() {

			// Ajaxでデータ取得
			var _promise = this._fetchData(this._page, this._searchCondition);

			var that = this;

			_promise.then(function(data) {

				// データの設定
				that.setData(data, this._page);

				// カルーセル表示データ設定
				that.setCarouselList(1, that._pageSize);

				// 一覧テーブル表示データ設定
				that.setShowList(1, 10);

				// カルーセルレンダリング
				that.carouselRender();

				// 一覧テーブルレンダリング
				that.listRender();

				// 一覧テーブルのスクロール生成
				that.scrollConstruct();

			}, function(errorMessage) {

				// 失敗のとき、エラーメッセージを出す
				alert(errorMessage);
			});
		},

		/**
		 * Ajaxでデータ取得
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		_fetchData: function(page, condition) {
			return this._bookLogic.getBookListData(this._pageSize, page, condition);
		},

		/**
		 * データの設定
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		setData: function(data) {

			var information;

			if(typeof data === 'object') {
    			information = data;
			} else {
    			information = JSON.parse(data);
			}

			var dataSize = information.list.length;

			var indexStart = (this._page - 1) * this._pageSize + 1;
			var indexEnd = indexStart + this._pageSize - 1;

			if(dataSize < this._pageSize) {
				indexEnd = indexStart + dataSize - 1;
			}

			var count = 0;

			// データを入れる
			for(var i = indexStart, len = indexEnd; i <= len; i++) {
				this._list[i] = information.list[count];
				this._list[i]['itemId'] = i;
				count++;
			}

			// データ数
			this._listSize = information.itemSize;
		},

		/**
		 * カルーセルデータ設定
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		setCarouselList: function(indexStart, indexEnd) {

			// カルーセル表示配列クリア
			this._carouselList = [];

			var count = 1;

			if(indexEnd > this._listSize) {
				indexEnd = this._listSize;
			}

			// 配列再設定
			for(var i = indexStart; i <= indexEnd; i++) {
				this._carouselList[count++] = this._list[i];
			}
		},

		/**
		 * 一覧テーブルデータ設定
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		setShowList: function(indexStart, indexEnd) {

			// 一覧表示配列クリア
			this._showList = [];

			var count = 1;

			if(indexEnd > this._listSize) {
				indexEnd = this._listSize;
			}

			// 配列再設定
			for(var i = indexStart; i <= indexEnd; i++) {
				this._showList[count++] = this._list[i];
			}
		},


		/**
		 * カルーセルレンダリング
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		carouselRender: function() {

			// 初期処理
			this._carouselController.init();

			// データ作成
			var dataList = this.makeCarouselElement(this._carouselList);

			// データレンダリング
			this._carouselController.appendItem(dataList);

			// 画面表示中データ
			this.setCarouselParam();
			
		},

		/**
		 * 一覧テーブルレンダリング
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		listRender: function() {

			// テンプレートバインド
			this.view.update('#list', 'list', {
				list: this._showList
			});
		},

		/**
		 * 一覧テーブルのスクロール生成
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		scrollConstruct: function() {

			// 表示データ数 < 10の時、スクロールいらない
			var total = this._listSize;
			if(total <= 10) {
				return;
			}

			var scrollParam = {
				mainArea: '.booklist',
				contentArea: '#list',
				showNum: 10,
				totalNum: total,
			};

			// スクロール初期化
			this._scrollBarController.init(scrollParam);

			// スクロール範囲を計算する
			this._scrollHeight = $('.scrollBarArea').height() - $('.scrollBarKnob').height(); 
		},

		/**
		 * スクロールバー移動スタートevent
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.scrollBarKnob h5trackstart': function(context, $el) {

			// eventが親エレメントにいく禁止
			var event = context.event;
			event.stopPropagation();

			// 現在のマウス位置Yを記録
			this._scrollStartMousePosY = event.pageY;

			// スクローリング中
			this._isScrolling = true;

			// スクロールバーtop値
			var css_top = $el.css('top');
			this._scrollAreaTop = parseFloat(css_top.substr(0, css_top.length - 2));

			// スクロール動作開始
			this._scrollBarController.scrollStart(context, $el);
		},

		/**
		 * スクロールバー移動event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.scrollBarKnob h5trackmove': function(context, $el) {

			// 現在のマウス位置Y取得
			var event = context.event;
			var mousePosY = event.pageY;

			// スクロール距離を計算
			var _top = this._scrollAreaTop + mousePosY - this._scrollStartMousePosY;
			if(_top < 0) {
				_top = 0;
			}

			if(_top > this._scrollHeight) {
				_top = this._scrollHeight;
			}

			// スクロールバーを動く
			this._scrollBarController.scrollMove(context, $el);

			// 一覧テーブルとカルーセル画面の連動動作を行う
			this._scroll(_top);
			
		},

		/**
		 * スクロールバー移動end event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.scrollBarKnob h5trackend': function(context, $el) {

			this._scrollAreaTop = null;
			this._scrollStartMousePosY = null;
			this._scrollBarController.scrollEnd(context, $el);
			this._isScrolling = false;
		},

		/**
		 * マウスウェル event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.booklist mousewheel': function(context) {
			
			context.event.preventDefault();

			var diff = (context.event.wheelDelta < 0) ? 1 : -1;

			var css_top = $('.scrollBarKnob').css('top');

			if(css_top) {

				var top = parseFloat(css_top.substr(0, css_top.length - 2));

				top += diff;

				if(top < 0) {
					top = 0;
				}

				// スクロールバーを動く
				this._scrollBarController.mousewheel(top);

				// 一覧テーブルとカルーセル画面の連動動作を行う
				this._scroll(top);
			}
		},

		/**
		 * マウスウェル event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.scrollBarArea mousewheel':  function(context) {
			
			context.event.preventDefault();

			var diff = (context.event.wheelDelta < 0) ? 1 : -1;

			var css_top = $('.scrollBarKnob').css('top');

			if(css_top) {

				var top = parseFloat(css_top.substr(0, css_top.length - 2));

				top += diff;

				if(top < 0) {
					top = 0;
				}

				// スクロールバーを動く
				this._scrollBarController.mousewheel(top);

				// 一覧テーブルとカルーセル画面の連動動作を行う
				this._scroll(top);
			}
			
		},

		/**
		 * マウスover event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'tr.rows mouseover': function(context, $el) {

			// 目標エレメントを取得
			var $target = $(context.event.target).parent();
			var itemID = $target.data('item-id');
			var $now = $("div[data-item-id=" + itemID + "]");

			// 目標エレメントはカルーセル中央に表示する

			// this.asyFunQueue.excuteFun(this._carouselController, this._carouselController.scrollToByElm, $now);
			this._carouselController.scrollToByElm($now);
			
		},

		/**
		 * マウスover event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'#list mouseleave': function(context, $el) {
			if(this.seletedItemID) {
				var $now = $("div[data-item-id=" + this.seletedItemID + "]");
				this._carouselController.scrollToByElm($now);
			}
		},

		/**
		 * マウスover event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'tr.rows click': function(context, $el) {
			
			// 目標エレメントを取得
			var $target = $(context.event.target).parent();
			var itemID = $target.data('item-id');

			if(!itemID) {
				$target = $target.parent();
				itemID = parseInt($target.data('item-id'));
			}
			
			$('.selectedTr').removeClass('selectedTr');

			if(this.seletedItemID === itemID) {
				this.seletedItemID = null;
			} else {
				$target.addClass('selectedTr');
				this.seletedItemID = itemID;
			}
		},

		/**
		 * カルーセル移動 event
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'.carousel-wrapper h5trackmove': function(context) {

			var $scrollingBase = this._carouselController._$scrollingBase;

			var $firstItem = $('.carousel-item-wrapper:first');

			var $lastItem = $('.carousel-item-wrapper:last');

			var firstItemLeft = parseFloat($firstItem.css('left'));

			var lastItemLeft = parseFloat($lastItem.css('left'));

			var firstId = $firstItem.data('item-id');

			var lastId = $lastItem.data('item-id');

			var that = this;

			// カルーセルの最後データに移動まで
			if(lastItemLeft < ($scrollingBase.innerWidth() + 1500) && lastId < this._listSize && ! this._isLoading) {

				this._isLoading = true;

				var $items = $scrollingBase.children();

                var startIndex = lastId + 1;
                var endIndex = lastId + this._pageSize;

                // 先頭のデータを削除
                if(lastId - firstId + 1 >= this._pageSize*3/2) {
                	for(var i=0, len=this._pageSize; i<len; i++) {
						$items[i].remove(); 
					}
                } else {
                	for(var i=0, len=this._pageSize/2; i<len; i++) {
						$items[i].remove(); 
					}
                }

 				// ローカルに表示のデータあるか確認
                if(this.isInLocalData(startIndex)) {

                	// カルーセルの表示データ設定
                	this.setCarouselList(startIndex, endIndex);

                	// カルーセルの表示エレメント作成
					var dataList = this.makeCarouselElement(this._carouselList);

					// カルーセル再レダリング
					this._carouselController.appendItem(dataList);

					// 表示中の先頭と最後ID設定
					this.setCarouselParam();

					this._isLoading = false;

                }  else {

                	// ローカルに表示のデータないの場合

                	// ページ数を計算
                	var page = parseInt(startIndex / this._pageSize) + 1;

                	// 対応データ取得
                	var promise = this._fetchData(page, this._searchCondition);

                	promise.done(function(data){

                		that._page = page;

                		// データ設定
                		that.setData(data);

                		// カルーセル表示データ設定
                		that.setCarouselList(startIndex, endIndex);

                		// エレメント作成
						var dataList = that.makeCarouselElement(that._carouselList);

						// カルーセルデータを表示
						that._carouselController.appendItem(dataList);

						// カルーセル表示中のパラ設定
						that.setCarouselParam();

						// 一覧テーブルデータ設定
						that.setShowList(lastId - 9, lastId);

						// 一覧テーブルレンダリング
						that.listRender();

						that._isLoading = false;
                	});
                }
            }

            // カルーセルの先頭のデータに移動まで
            if(firstItemLeft > - 1000 && firstId > 1  && !this._isLoading) {

				this._isLoading = true;

				var $items = $scrollingBase.children();
						
                var endIndex = firstId - 1;
                var startIndex = endIndex - this._pageSize + 1;
                if(startIndex <= 0) {
                	startIndex = 1;
                }

                // 後ろのデータを削除
                if(lastId - firstId + 1 >= this._pageSize*3/2) {
                	for(var i=$items.length - 1, len=$items.length - 1 - this._pageSize; i>len; i--) {
						$items[i].remove(); 
					}
                } else {
                	for(var i=$items.length - 1, len=$items.length - 1 - this._pageSize/2; i>len; i--) {
						$items[i].remove(); 
					}
                }

				// ローカルにデータがあるか確認
                if(this.isInLocalData(startIndex)) {

                	// カルーセルデータ設定
                	this.setCarouselList(startIndex, endIndex);

                	// データ設定
					var dataList = this.makeCarouselElement(this._carouselList);

					// カルーセルレンダリング
					this._carouselController.prependItem(dataList);

					// カルーセル表示中パラ設定
					this.setCarouselParam();

					this._isLoading = false;

					
                }  else {

                	var page = parseInt(startIndex / this._pageSize) + 1;

                	var promise = this._fetchData(page);

                	promise.done(function(data){

                		that._page = page;

                		// データ設定
                		that.setData(data);

                		// カルーセル表示データ設定
                		that.setCarouselList(startIndex, endIndex);

                		// カルーセルエレメント作成
						var dataList = that.makeCarouselElement(that._carouselList);

						// カルーセルレンダリング
						that._carouselController.prependItem(dataList);

						// カルーセル表示中パラ設定
						that.setCarouselParam();

						that._isLoading = false;

						// 一覧テーブル表示データ設定
						that.setShowList(firstId, firstId + 9);

						// 一覧テーブル表示レンダリング
						that.listRender();
                	});
                }
            }

            // 一番中央のアイテムのIDを計算
            var $carousels = $(this._carouselController._$scrollingBase.children());

			var maxNum = 0;
			var $target = null;

			for(var i=0, len=$carousels.length; i<len; i++) {
				var carousel = $carousels[i];
				var transform = $(carousel).css('transform');
				if(transform !== 'none') {
					var num = transform.split(',')[0].substr(7);
					if(num > maxNum) {
						maxNum = num;
						$target = $(carousel);
					}
				}
			}

			var id = $target.data('item-id');

			// 一覧テーブルに対応のアイテムのstyleを設定
			var booklist = $('tr.rows');
			booklist.removeClass('selectedTr');

			var $now = $("tr[data-item-id=" + id + "]");
			if($now.length) {
				$now.addClass('selectedTr');
				this.seletedItemID = id;
			} else {
				if(this.isInLocalData(id+9)) {
					this.setShowList(id, id + 9);
				} else {
					this.setShowList(id-9, id);
				}
				
				this.listRender();
			}

			var top = this._scrollHeight * id / this._listSize;

			this._scrollBarController.mousewheel(top);
		},

		/**
		 * 検索ボタンをクリック
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		'#searchButton click': function(context, $el) {
			this.removeElement('#list tbody');
			this.removeElement('.scrollBarArea');
			this.removeElement('.noSearchList');
			this.loadConstruct();
			this.asyFunQueue.excuteFun(this, this._searchBooks);
			
		},

		'{document} keydown': function(context, $el) {
			var event = context.event;

			if(event && event.keyCode == 13) {
				$('#searchButton').trigger('click');
			}
		},
		
		_searchBooks: function() {

			this.removeElement('.spinner');

			var condition = this._getCondition();

			this._page = 1;

			var promise = this._fetchData(1, condition);

			var that = this;
			
			promise.then(function(data){

				var information;

				if(typeof data === 'object') {
	    			information = data;
				} else {
	    			information = JSON.parse(data);
				}

				if(information.itemSize == 0) {

					that.removeElement('.scrollingBase');
					
					var $none = $('div.noSearchList');
					var len = $none.length;
					var html = '<div class= "noSearchList">未检索到相应条件的内容！</div>';

					if($none.length == 0) {
			    		$none = $(html);
			    		$('.booklist').append($none);
					}

					return;
				}

				that._list = [];

				// 数据设定
				that.setData(data, that._page);

				that._searchCondition = condition;

				that.removeElement('.scrollingBase');
				that.removeElement('.scrollBarArea');

				// 轮播显示画面数据设定
				var num = that._pageSize;
				if(that._listSize < that._pageSize) {
					num = that._listSize;
				}
				that.setCarouselList(1, num);

				// 一览显示画面数据设定
				that.setShowList(1, 10);

				// 轮播部件渲染
				that.carouselRender();

				// 一览结果渲染
				that.listRender();

				// 滚动条生成
				that.scrollConstruct();

				if(num <= 10 && num > 0) {

					var center = parseInt(num / 2 + 1);
					var $now = $("div[data-item-id=" + center + "]");

					// 目標エレメントはカルーセル中央に表示する
					that._carouselController.scrollToByElm($now);
				}
			});
		},
		
		/**
		 * 一覧テーブルとカルーセルの連動動作
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		_scroll: function(_top) {
		
			// スクロールバーのtop値によって、一覧テーブル表示のデータを決める
			var startIndex = parseInt(this._listSize / this._scrollHeight * _top) + 1;
			var endIndex = startIndex + 9;

			if(startIndex >= this._listSize - 9) {
				startIndex = this._listSize - 9;
				endIndex = this._listSize;
			}

			// ローカルデータにいるかどうかを確認、ないの場合Ajaxで対応のデータを請求する
			if(!this.isInLocalData(startIndex) || !this.isInLocalData(endIndex)) {

				this.removeElement('#list tbody');

				this.loadConstruct();

				var args = [startIndex, endIndex];
				this.asyFunQueue.excuteFun(this, this.getDataAndRender, args);

			} else {
				
				// ローカルにデータがある時

				// 一覧テーブルデータを設定
				this.setShowList(startIndex, endIndex);

				// 一覧テーブルレンダリング
				this.listRender();

				// カルーセルにデータがあるか確認、ないの場合カルーセルデータを再設定、レンダリング
				if(startIndex < this._firstID || endIndex > this._lastID) {

					this.carouselRenderWhenScroll(startIndex, endIndex);
				}
			}
		},

		/**
		 * 対応データ取得し、レンダリング
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		getDataAndRender: function(args) {

			var startIndex = args[0];
			var endIndex = args[1];

			var promise1, promise2;

			var that = this;

			var p1 = Math.ceil(startIndex / this._pageSize);
			var p2 = Math.ceil(endIndex / this._pageSize);

			promise1 = this.getDataByIndex(startIndex);

			if(p2 === p1) {
				promise2 = Promise.resolve();
			} else {
				promise2 = this.getDataByIndex(endIndex);
			}
			
			$.when(promise1, promise2).done(function() {
					
				// 一覧テーブルデータを設定
				that.setShowList(startIndex, endIndex);

				that.removeElement('.spinner');

					// 一覧テーブルレンダリング
					that.listRender();

					that.carouselRenderWhenScroll(startIndex, endIndex);
			});
		},

		/**
		 * 表示中のカルーセルの先頭と最後のIDを設定する
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		setCarouselParam: function() {

			this._firstID = $('.carousel-item-wrapper:first').data('item-id');
			this._lastID = $('.carousel-item-wrapper:last').data('item-id');
		},

		makeCarouselElement: function(data) {

			var array = [];

			for(var i=1, len=data.length; i<len; i++) {

				if(data[i]) {
					var _$item =$('<div class="item"></div>');
				_$item.css({
					'background': 'url('+ data[i].cover_page_url + ')',
					'background-size': '100%',
					'float': 'left'
				});

				_$item['itemId'] = data[i].itemId;

				array.push(_$item);
				}
				
			}

			return array;
		},

		/**
		 * ローカルにデータがあるか確認
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		isInLocalData: function(index) {

			if(typeof this._list[index] == "undefined") {
				return false;
			}

			return true;
		},

		/**
		 * データ取得中のメッセージを出す
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		loadConstruct: function() {

			var html = '<div class="spinner">';

			html += '<div class="spinner-container container1">';
			html += '<div class="circle1"></div>';
			html += '<div class="circle2"></div>';
			html += '<div class="circle3"></div>';
			html += '<div class="circle4"></div>';
			html += '</div>';

			html += '<div class="spinner-container container2">';
			html += '<div class="circle1"></div>';
			html += '<div class="circle2"></div>';
			html += '<div class="circle3"></div>';
			html += '<div class="circle4"></div>';
			html += '</div>';

			html += '<div class="spinner-container container3">';
			html += '<div class="circle1"></div>';
			html += '<div class="circle2"></div>';
			html += '<div class="circle3"></div>';
			html += '<div class="circle4"></div>';
			html += '</div>';

			html += '</div>';

			var $load = $('.spinner');
			var len = $load.length;

			if($load.length == 0) {
			    $load = $(html);
			    $('.booklist').append($load);
			}
		},

		/**
		 * データ取得のPromiseを返す
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		getDataByIndex: function(index) {

			var promise = null;

			if(!this.isInLocalData(index)) {

				var page = parseInt(index / this._pageSize) + 1;

				var that = this;

				var promise = this._fetchData(page, this._searchCondition).then(function(data) {

					that._page = page;

					that.setData(data);

				});

			} else {
				promise = Promise.resolve();
			}

			return promise;
		},

		/**
		 * スクロール時、カルーセルの再レダリング
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		carouselRenderWhenScroll: function(startIndex, endIndex) {

			var p1 = Math.ceil(startIndex / this._pageSize);
			var p2 = Math.ceil(endIndex / this._pageSize);

			if(endIndex > this._listSize) {
				p2 = Math.ceil(this._listSize / this._pageSize);
			}

			var carouselStart, carouselEnd;

			// カルーセル内容をクリア
			var $scrollingBase = this._carouselController._$scrollingBase;
			var $items = $scrollingBase.children();
			$items.remove();

			if(p1 === p2) {
				carouselEnd = p1 * this._pageSize;
				carouselStart = carouselEnd - this._pageSize + 1;
			} else {
				carouselEnd = p2 * this._pageSize;
				carouselStart = carouselEnd - this._pageSize * 3 / 2  + 1;
			}

			// カルーセル表示データ設定
			this.setCarouselList(carouselStart, carouselEnd);

            // カルーセル表示エレメント作成
			var dataList = this.makeCarouselElement(this._carouselList);

			// 表示エレメントをレダリング
			this._carouselController.appendItem(dataList);

			// カルーセルの先頭と最後IDを設定
			this.setCarouselParam();
		},

		/**
		 * エレメントを削除
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		removeElement: function(el) {
			$(el).remove();
		},

		/**
		 * 検索条件を取得する
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		_getCondition: function() {
			
			var condition = "condition:" + $("input[id='isbn']").val() + "," + 
							"condition:" + $("input[id='title']").val() + "," + 
							"condition:" + $("input[id='author']").val() + "," + 
							"condition:" + $("input[id='translator']").val() + "," + 
							"condition:" + $("input[id='priceStart']").val() + "," + 
							"condition:" + $("input[id='priceEnd']").val();

			return encodeURI(condition);
		}
	}; 

	$(function() {
		h5.core.controller('#container', bookController);
	});


}) (jQuery);