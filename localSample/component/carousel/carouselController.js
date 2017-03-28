(function($) {

	/**
	 * cssのプロパティキーにベンダープレフィックスを追加 animate.jsからコピペ
	 */
	function addVenderPrefix(css, key, isOverride) {
		var _css = (isOverride) ? css : $.extend(true, {}, css);
		if (key) {
			if (typeof key == 'string') {
				key = [key];
			}
			$.each(key, function() {
				if (this in css) {
					_css['-moz-' + this] = css[this];
					_css['-webkit-' + this] = css[this];
					_css['-o-' + this] = css[this];
					_css['-ms-' + this] = css[this];
				}
			});
		} else {
			for ( var i in css) {
				_css['-moz-' + i] = css[i];
				_css['-webkit-' + i] = css[i];
				_css['-o-' + i] = css[i];
				_css['-ms-' + i] = css[i];
			}
		}
		return _css;
	}

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| function(func) {
				window.setTimeout(func, 15);
			};

	var carouselController = {

		__name: 'h5.ui.components.carousel.CarouselController',

		_$scrollingBase: null,

		_itemSize: 200,

		_visibleItemsNum: 14,

		_startPos: -300,

		_isScrolling: false,

		_isMoved: false,

		_seq: 1,

		init: function() {

			var $root = $(this.rootElement);

			var style = {
				overflow: 'hidden'
			};

			var _$scrollingBase = $('<div class="scrollingBase"></div>');
			_$scrollingBase.css({
				display: 'block',
				height: '100%',
				width: '100%',
				position: 'relative',
				top: 0,
				left: 0
			});

			$root.append(_$scrollingBase);
			this._$scrollingBase = _$scrollingBase;
		},

		appendItem: function(elm) {
			this._addItem(elm);
			this._itemTransFormRefresh();
		},

		prependItem: function(elm) {
			this._addItem(elm, true);
			this._itemTransFormRefresh();
		},

		_addItem: function(elm, prepend) {

			if (!elm || elm.length === 0) {
				return;
			}

			var $elm = $(elm);

			var i;

			if(prepend) {

				for (var i = $elm.length - 1, len = 0 ; i >= len; i--) {
				
					var $item = $elm.eq(i);
					if (!$item.hasClass('carousel-item-wrapper')) {
						$item = $('<div class="carousel-item-wrapper"></div>');
						$item.append($(elm)[i]);
					}

					var left = this._getFirstPos() - this._itemSize;
					
					$item.css({
						position: 'absolute',
						left: left
					});

					$item.attr('data-item-id', $(elm)[i].itemId);

					this._$scrollingBase.prepend($item);
				}
				
			} else {

				for (var i = 0, len = $elm.length; i < len; i++) {
				
					var $item = $elm.eq(i);
					if (!$item.hasClass('carousel-item-wrapper')) {
						$item = $('<div class="carousel-item-wrapper"></div>');
						$item.append($(elm)[i]);
					}

					var left = this._getLastPos();

					$item.css({
						position: 'absolute',
						left: left
					});

					$item.attr('data-item-id', $(elm)[i].itemId);

					this._$scrollingBase.append($item);
				}
				
			}
		},

		_createItemId: function() {
			return this._seq++;
		},

		_getFirstPos: function() {
			var $first = this._$scrollingBase.find('.carousel-item-wrapper:first');
			return $first.length ? parseInt($first.css('left')) : this._startPos;
		},

		_getLastPos: function() {
			var $last = this._$scrollingBase.find('.carousel-item-wrapper:last');
			return $last.length ? parseInt($last.css('left')) + this._itemSize : this._startPos;
		},

		_itemTransFormRefresh: function() {
			
			var viewWH = $(this._$scrollingBase).innerWidth();
			var itemSize = this._itemSize;
			var scrollLT = parseInt(this._$scrollingBase.css('left'));
			var that = this;
			var c = this._$scrollingBase.children();
			this._$scrollingBase.children().each(function() {
				var $this = $(this);

				var lt = $this.css('left');
				var left = lt.substr(0, lt.length - 2);

				var itemViewPos = scrollLT + parseInt($this.css('left')) + itemSize / 2;

				var distFromCenter = Math.abs(viewWH / 2 - itemViewPos);
				
				var scale = 1 - distFromCenter / viewWH;
		
				scale = scale < 0.1 ? 0 : scale;

				var opacity = scale ? Math.min(1, (scale * 2 - 0.1)) : 0;

				var transDist = scale ? ((itemViewPos > viewWH / 2 ? -1 : 1) * (1 - scale)
						* (1 - scale) * viewWH / 2) : 0;

				var styleObj = $.extend(
					{
						opacity: opacity
					}, 
					addVenderPrefix({
						transform: h5.u.str.format('matrix({0},0,0,{0},{1})', scale, this.type == 'horizontal' ? '0,' + transDist : transDist + ',0')
					})
				);
				$(this).css(styleObj);

			});
		},

		'{rootElement} h5trackstart': function(context) {
			this._h5trackstart(context);
		},
		/**
		 * @memberOf h5.ui.components.carousel.CarouselController
		 * @param context
		 */
		'{rootElement} h5trackmove': function(context) {
			// h5trackend時に動いたかどうか分かるようにしておく
			this._isMoved = true;
			this._h5trackmove(context);
		},
		/**
		 * @memberOf h5.ui.components.carousel.CarouselController
		 * @param context
		 */
		'{rootElement} h5trackend': function(context, $el) {
			this._h5trackend(context);
		},



		_h5trackstart: function(context) {
			context.event.preventDefault();
			this._isScrolling = true;
		},
		
		_h5trackmove: function(context) {
			context.event.preventDefault();
			this.scroll(context.event.dx);
		},

		scrollToByElm: function(elm) {
			var $elm = $(elm);
			var d = (this._$scrollingBase.innerWidth() - this._itemSize) / 2
					- parseInt($elm.css('left')) + parseInt(this._$scrollingBase.css('left'));

			
			// var progerssEnd = d;
			

			// var start = 0;
			// var that = this;
			 
			// function step(timestamp) {

			// 	if(d >= 0) {
			// 		start= start + 1;
			// 		that.scroll(1);
			// 		that._recalcPosition();
			// 	    if (start < progerssEnd) {
			// 	        requestAnimationFrame(step);
			// 	    }
			// 	} else {
			// 		start = start - 1;
			// 		that.scroll(-1);
			// 		that._recalcPosition();
			// 	    if (start >= progerssEnd) {
			// 	        requestAnimationFrame(step);
			// 	    }
			// 	}
			    
			// }
			// requestAnimationFrame(step);

			this.scroll(d);
			this._recalcPosition();
		},

		scroll: function(d) {

			var $base = this._$scrollingBase;
			if (!$base.children().length) {
				return;
			}
			var style = {};

			var left = (parseFloat($base.css('left')) || 0) + d;

			var firstItemLeft = parseFloat($('.carousel-item-wrapper:first').css('left'));

			if(firstItemLeft + left > (this._$scrollingBase.innerWidth() - this._itemSize) / 2) {
				return;
			}

			var lastItemLeft = parseFloat($('.carousel-item-wrapper:last').css('left'));

			if(lastItemLeft + left < this._$scrollingBase.innerWidth() - 700) {
				return;
			}

			$base.css({
				left: left
			});

			// トランスフォーム更新
			this._itemTransFormRefresh();
		},

		_h5trackend: function(context) {
			var that = this;
			this._isScrolling = false;
			setTimeout(function() {
				that._isMoved = false;
			}, 0);
			this._recalcPosition();
		},

		_recalcPosition: function() {
			var d = parseFloat(this._$scrollingBase.css('left'));
			this._$scrollingBase.css('left', 0);
			var that = this;
			this._$scrollingBase.children().each(function() {
				var lt = parseFloat($(this).css('left'));
				$(this).css('left', lt + d);
			});
		}

	};

	h5.core.expose(carouselController);
}) (jQuery);