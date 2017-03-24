(function($){

	// strictモード
	'use strict';

	// 01.基本編
	var foundation = {
		'url': 'foundation.html',
		'articles': {

			// 01.準備
			'01': 'article_01_forStart',
			// 02.HelloWorld
			'02': 'article_02_helloWorld',
			// 03.コントローラ
			'03': 'article_03_controller',
			// 04.ビュー
			'04': 'article_04_view',
			// 05.ロジック
			'05': 'article_05_logic',
			// 06.非同期処理
			'06': 'article_06_asyn',
			// 07.単体テスト
			'07': 'article_07_test',
			// 08.ドキュメント記述・生成(JSDoc)
			'08': 'article_08_JSDoc',
			// 09. AOP(アスペクト)の適用
			'09': 'article_09_AOP',
		}
	};

	// 02.データモデル編
	var dataModel = {
		'url': 'dataModel.html',
		'articles': {

			// 01.データモデル機構について
			'01': 'article_01_dataStructure',
			// 02.基本的な使い方
			'02': 'article_02_modelUseMethod',
			// // 03.ディスクリプタの書き方
			'03': 'article_03_descriptor',
			// 04.データアイテムの更新とイベント
			'04': 'article_04_refreshAndEvent',
		}
	};

	// 03.データバインド編
	var dataBind = {
		'url': 'dataBind.html',
		'articles': {

			// 01.データバインド機構について
			'01': 'article_01_dataBindStructure',
			// 02.基本的な使い方
			'02': 'article_02_bindMethod',
			// 03.配列・ObservableArrayのバインド
			'03': 'article_03_bindArray',
			// 04.todoアプリ 概要
			'04': 'article_04_todoProfile',
			// 05.todoアプリ データモデルの作成
			'05': 'article_05_todoDataModel',
			// 06.todoアプリ ビューの作成
			'06': 'article_06_todoView',
			// 07.todoアプリ ロジックの作成
			'07': 'article_07_todoLogic',
			// 08.todoアプリ コントローラの作成
			'08': 'article_08_todoController',
		}
	};


	// contents
	var docs = {

		// 01.基本編
		'01': foundation,
		// 02.データモデル編
		'02': dataModel,
		// 03.データバインド編
		'03': dataBind,
	};

	var arr = window.location.href.split('/');
	var pageName = arr[arr.length-1];

	var arr1 = pageName.split('.');
	var viewName = arr1[0];

	var templatesObject = null;

	for(var p in docs) {
		if(pageName === docs[p].url) {
			templatesObject = docs[p].articles;
			 break;
		}
	}

	var viewPath = 'view/' + viewName + '/';

	// templates
	var templates = [];

	for(var p in templatesObject) {
		templates.push(viewPath + templatesObject[p] + '.ejs');
	}

	// page Controller
	var pageController = {

		// 名称
		__name: 'h5.PageController',

		// templates
		__templates: templates, 

		/**
		 * 初期処理
		 *
		 * @memberOf JDWeb.book.BookController
		 * @param
		 */
		__ready: function() {
			this.view.update('.content', templatesObject['01']);
		},

		// 段落をクリックすると、翻訳前の日本語を出る
		'.translate-cn click': function(context, $el) {
			var $target = $el.next() 
			if($target.hasClass('hidden')) {
				$target.removeClass('hidden');
			} else {
				$target.addClass('hidden');
			}
		},


		// 左側のリストをクリックすると、対応のページが出る
		'.sidenav-section click': function(context, $el) {

			// スタイルの変更
			this.$find('.sidenav-section').removeClass('is-selected');
			$el.addClass('is-selected');

			var id = $el.data('page');

			// ビューの更新
			this.view.update('.content', templatesObject[$el.data('page')]);

			// ページの先頭に戻す
			document.documentElement.scrollTop = document.body.scrollTop =0;
		},

		// 上のリストをクリックすると、対応のページが出る
		'.l-list click': function(context, $el) {

			// スタイルの変更
			this.$find('.l-list').removeClass('list-selected');
			$el.addClass('list-selected');

			var url = docs[$el.data('list')].url;

			window.location.href = url;
		},

	}

	$(function() {
		h5.core.controller('body', pageController);
	});

})(jQuery);