(function($) {

	'use strict';

	/**
	 * 書籍コントローラ
	 *
	 * @class
	 * @name bookController
	 */
	var bookController = {

		/**
		 * コントローラ名
		 *
		 * @memberOf JDWeb.book.BookController
		 * @type string
		 */
		__name: 'JDWeb.book.BookController',

		/**
		 * CarouselControllerライブラリ
		 *
		 * @memberOf h5.ui.components.carousel.CarouselController
		 * @type Controller
		 */
		_carouselController: h5.ui.components.carousel.CarouselController,

		/**
		 * ロジック
		 *
		 * @memberOf JDWeb.book.BookLogic
		 * @type string
		 */
		_bookLogic: JDWeb.book.BookLogic,

		/**
		 * メタ定義
		 *
		 * @memberOf JDWeb.book.BookController
		 * @type object
		 */
		__meta: {
			_carouselController: {
				rootElement: '.carousel-wrapper'
			}
		},

		__templates: 'list.ejs',

		// --- private Property --- //

		// --- ライフサイクル関連メソッド --- //
		/**
		 * 初期処理
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		__ready: function() {
			
			var that = this;

			var _promise = this._bookLogic.getBookListData();

			_promise.done(function(data) {

				// カルーセル初期化
				var $carouselRoot = $(that._carouselController.rootElement);
				that._bookLogic.makeCarouselElement($carouselRoot, data);
				that._carouselController.init();

				// var bookList = JSON.parse(data);

				that.view.append('#list', 'list', {
					data: data
				});
			});
		},

		'tr.rows mouseover': function(context, $el) {
			
			var $target = $(context.event.target).parent();
			var itemID = $target.data('tr-id')
			var scrollList = $('.scrollingBase').children();
			for(var i=0, len=scrollList.length; i<len; i++) {
				var $now = $(scrollList[i]);
				if(itemID == $now.data('item-id')) {
					this._carouselController.scrollToByElm($now);
					break;
				}
			}	
			$('.selectedTr').removeClass('selectedTr');
		},

		'.carousel-wrapper h5trackmove': function(context) {

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

			var booklist = $('tr.rows');
			booklist.removeClass('selectedTr');
			
			for(var i=0, len=booklist.length; i<len; i++) {
				var $now = $(booklist[i]);
				if(id == $now.data('tr-id')) {
					$now.addClass('selectedTr');
					break;
				}
			}

			var dx = 46 * id;

			this.scrollToLocation(dx);	
		},

		scrollToLocation: function(dx) {
			var container = $('.booklist');
			container.animate({
    			scrollTop: dx
  			}, 0);
		}
	}; 

	$(function() {
		h5.core.controller('#container', bookController);
	});


}) (jQuery);