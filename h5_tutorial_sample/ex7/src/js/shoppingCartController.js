(function(){

	// 购物车controller
	var shoppingCartController = {

		// name
		__name: 'shoppingCartController',

		// template
		__templates: 'view/buyList.ejs',

		buyList: {},

		totalNum: 0,

		// 添加到购物车
		'{rootElement} addToCart': function(context) {
			if(context.evArg) {
				var key = context.evArg.key;
				var title = context.evArg.title;
				var price = context.evArg.price;
				if(!this.buyList[key]) {
					this.buyList[key] = {};
					this.buyList[key].title = title;
					this.buyList[key].price = price;
					this.buyList[key].key = key;
					this.buyList[key].num = 1;
				} else {
					this.buyList[key].num ++;
				}
			}
			this.totalNum++;
			
			this.updateBuyList(this.buyList);
			this.updateCartNum(this.totalNum);
		},

		// 返回
		'{rootElement} back': function() {
			this.showCartIcon();
			this.hideCartList();
		},

		// 点击购物车图标
		'.cartIcon click': function() {
			this.hideCartIcon();
			this.showCartList();
		},

		// 点击返回按钮
		'.returnBtn click': function() {
			this.showCartIcon();
			this.hideCartList();
		},

		// 数量增加
		'.addNumBtn click': function(context, $el) {
			var key = $el.data('key');
			this.buyList[key].num = this.buyList[key].num + 1;
			this.totalNum++;

			this.updateBuyList(this.buyList);
			this.updateCartNum(this.totalNum);
		},

		// 数量减少
		'.minNumBtn click': function(context, $el) {
			var key = $el.data('key');
			var preNum = this.buyList[key].num;
			this.buyList[key].num = this.buyList[key].num === 0 ? 0 : (this.buyList[key].num - 1);

			this.totalNum = this.totalNum + this.buyList[key].num - preNum;

			this.updateBuyList(this.buyList);
			this.updateCartNum(this.totalNum);
		},

		// 输入数量
		'.inputNum blur': function(context, $el) {
			var key = $el.data('key');
			var value = $el.val();

			if(isNaN(value)) {
				value = 0;
			}
			var preNum = this.buyList[key].num;
			this.buyList[key].num = Number(value);
			this.totalNum = this.totalNum - preNum + this.buyList[key].num;

			this.updateBuyList(this.buyList);
			this.updateCartNum(this.totalNum);
		},

		// 删除按钮
		'.removeBtn click': function(context, $el) {
			var key = $el.data('key');
			var num = this.buyList[key].num;
			delete this.buyList[key];
			this.totalNum -= num;

			this.updateBuyList(this.buyList);
			this.updateCartNum(this.totalNum);
		},

		// 支付按钮
		'.payBtn click': function(context, $el) {
			alert('支付成功！');
		},

		// 隐藏购物车图标
		hideCartIcon: function() {
			this.$find('.cartIcon').hide();
		},

		// 显示购物车图标
		showCartIcon: function() {
			this.$find('.cartIcon').show();
		},

		// 显示购物车一览
		showCartList: function() {
			this.$find('.cartList').animate({left: '0.5rem'});
		},

		// 显示购物车一览
		hideCartList: function() {
			this.$find('.cartList').animate({left: '-50rem'});
		},

		// 刷新结果一览
		updateBuyList: function(buyList) {
			this.view.update('#buyList', 'buyList', {
				buyList: buyList,
			})
		},

		// 刷新购物车中商品数量
		updateCartNum: function(totalNum) {
			this.$find('.cartIcon').attr('data-num', totalNum);
		}
	};

	// グローバルに公開する
	h5.core.expose(shoppingCartController);
})();
