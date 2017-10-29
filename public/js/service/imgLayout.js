angular.module("Slider.Common")

.service("imgLayout",function() {

	var elx = function () {
		this.id = 0;
		this.rect = {
			col: 0, row: 0
		};
		this.size = {
			width: 0, height: 0
		};
		this.pos = {
			x: 0, y: 0
		};
		this.ani = false;
	};
	     elx.prototype = {
		isOccupy: function (rt, block, target) {

			if(rt.col ==this.rect.col && rt.row == this.rect.row)
				return true;

			var width = block.width, height = block.height,
				t_width = width, t_height = height;

			if (target && target !== null) {
				t_width = target.width;
				t_height = target.height;
			}
			var availW = 0, availH=0;

			var sx1 = rt.col * width, sx2 = sx1 + t_width,
				sy1 = rt.row * height, sy2 = sy1 + t_height;

			if(sx2 > $(window).width())
				return true;

			var bx1 = this.rect.col * width-availW, bx2 = bx1 + this.size.width+availW,
				by1 = this.rect.row * height-availH, by2 = by1 + this.size.height+availH;

			var ch_0 = bx1 >= sx2 || bx2 <= sx1 || by1 >= sy2 || by2 <= sy1;
			return  !ch_0;
		},

		setRect: function (r) {
			this.rect.col = r.col;
			this.rect.row = r.row;
		}
	};

	this.pageCount = 0;
	this.count = 0;
	this.rectSize = {col: 8, row: 100};
	this.blockSize = {width: 50, height: 50};
	this.ref= {left:0,top:60};
	this.capacity = 5000;
	this.elements = [];
	this.element = '';
	this.policy = 'row';
	this.collision = function (r, target) {
		var blockSize = this.blockSize;
		var isFound = false;
		// var target = (target)? target : null;
		this.elements.forEach(function (el, ix) {
			if (el.isOccupy(r, blockSize, target)) {
				isFound = true;
			}
		});
		return isFound;
	}
	this.init = function(){
		this.elements = [];
		this.count = 0;
		this.rectSize.col = Math.ceil( ( $(window).width() - this.ref.left*2) / this.blockSize.width);
	}
	this.next = function () {
		var rect ={col:0, row:0};
		for (var i = 0; i < this.capacity; i++) {
			rect.col = (i % this.rectSize.col);
			rect.row = Math.floor(i / this.rectSize.col);

			if (!this.collision(rect)) {
				if (!this.collision(rect, this.element.size)) {
							// console.log("this.rectSize.col="+this.rectSize.col);
					return rect;
				}
			}
		}
		return rect;
	};
	this.setLocation = function () {
		var next = this.next();
		this.element.setRect(next);
		this.elements.push(this.element);
		this.count++;
	};
	this.getPos = function(index) {
		var ret = {};
		var found = this.getElement(index);
		if( found !== null) {
			ret.left = found.rect.col * this.blockSize.width + this.ref.left;
			ret.top = found.rect.row * this.blockSize.height + this.ref.top;
			ret.width = found.size.width;
			ret.height = found.size.height;
		}
		return ret;
	};
	this.getElement = function (index) {
		return this.elements[index];
	};

	this.matrix= [];
	enable= function () {
		return true;
	};
	this.register = function (id, width, height, posX, posY, ani) {
		var el = new elx();
		el.id = id;
		el.size.width = width;
		el.size.height = height;
		el.pos.x = posX;
		el.pos.y = posY;
		el.ani = ani;
		this.element = el;
		this.setLocation();

		return this;
	}
	this.toString = function () {
		var re = $('<table id="data"><tr><td>row</td><td>col</td><td>width</td><td>height</td></tr></table>');
		this.elements.forEach(function (el, ix) {
			re.append('<tr><td>' + el.rect.row + '</td><td>' + el.rect.col + '</td><td>' + el.size.width + '</td><td>' + el.size.height + '</td></tr>');
			console.log(el);
		});

		// $("#imgLayout").append(re);
	}
});
