(function(){

	// 详细栏controller
	var detailController = {

		// name
		__name: 'detailController',

		// template
		__templates: 'view/bookDetail.ejs',

		// book
		book: null,

		// 详细信息展示
		'{rootElement} showDetail': function(context) {
			this.book = context.evArg;
			this.view.update('#bookDetail', 'bookDetail', {
				book: context.evArg
			});
			this.trigger('showCart');
		},

		// 添加到购物车
		'#cartBtn click': function() {
			this.trigger('addToCart', this.book);
			this.addSuccess();
		},

		// 添加成功提示语
		addSuccess: function() {
			var $detail = this.$find('.detail');
			var $promp = $('<div class="success">已加入购物车！</div>');
			$detail.append($promp);
			setTimeout(function(){
				$promp.remove();
			}, 1000);
		}
	};

	// グローバルに公開する
	h5.core.expose(detailController);
})();
