(function() {

	'use strict';

	var abs = Math.abs;
	var min = Math.min;
	var max = Math.max;
	var atan2 = Math.atan2;
	var sqrt = Math.sqrt;
	var pi = Math.PI;
	var RAD2DEG = 180 / pi;
	var DEG2RAD = pi / 180;
	var boundaries;

	// private methods
	function transformPoint(from, matrix, to) {
		// to and from could be the same object
		var x = from.x;
		to.x = x * matrix.a + from.y * matrix.c + matrix.e;
		to.y = x * matrix.b + from.y * matrix.d + matrix.f;
	}

	function copyPoint(from, to) {
		to.x = from.x;
		to.y = from.y;
	}

	function applyDimensions(x, y, width, height) {
		this.origin.x = x;
		this.origin.y = y;
		this.right.x = x + width;
		this.right.y = y;
		this.bottom.x = x;
		this.bottom.y = y + height;
		return this;
	}

	function applyPoints(origin, right, bottom) {
		copyPoint(origin, this.origin);
		copyPoint(right, this.right);
		copyPoint(bottom, this.bottom);
		return this;
	}

	function scale(hor) {
		var a = this.right.x - this.origin.x;
		var b = this.right.y - this.origin.y;
		var c = this.bottom.x - this.origin.x;
		var d = this.bottom.y - this.origin.y;
		var sx = sqrt(a * a + b * b);
		var sy = sqrt(c * c + d * d);

		if (a * d - c * b < 0) {
			if (a < d) {
				sx = -sx;
			} else {
				sy = -sy;
			}
		}
		return hor ? sx/this.stashed.width : sy/this.stashed.height;
	}

	function distance(a, b) {
		var x = abs(a.x - b.x);
		var y = abs(a.y - b.y);
		return sqrt( x*x + y*y );
	}


	// this is for bounds support, getters only, no init values
	function BaseRectangle() {
		this.origin = {x: 0, y: 0};
		this.right = {x: 0, y: 0};
		this.bottom = {x: 0, y: 0};
	}

	/*
		i need BaseRectangle to have only getters, its much easier to just copy-paste those methods to Rectangle
		prototype...than to set up some for loop to properly mix those 2 protos together ( and the mixin code itself is longer )
	*/
	BaseRectangle.prototype = {

		// copy those 4 getters to Rectangle.prototype
		get width() {
			return distance(this.right, this.origin);
		},

		get height() {
			return distance(this.bottom, this.origin);
		},

		get x() {
			return this.origin.x;
		},

		get y() {
			return this.origin.y;
		},

		// center is calculated in absolute values - eg. if x = 300 and width is 100, then center is 350
		get cx() {
			return this.origin.x + this.width/2;
		},

		get cy() {
			return this.origin.y + this.height/2;
		}

	};

	function create(Matrix) {

		if ( !Matrix) {
			throw new ReferenceError('Rectangle\'s dependancy Matrix is not defined');
		}

		boundaries = new BaseRectangle();

		/*
			0 -> new Rectangle()
			x,y,width,height -> new Rectangle(0, 0, 200, 100)
			width, height -> new Rectangle(200, 100)
			points -> new Rectangle({x:1, y:1}, {x:5, y:0}, {x:2, y:5})
			copy -> mew Rectangle( R )
			clone -> new Rectangle( R, true )

		*/
		function Rectangle(x, y, width, height) {

			if ( !(this instanceof Rectangle) ) {
				return new Rectangle(x, y, width, height);
			}
			BaseRectangle.call(this);
			this.mtrx = Matrix();
			var stash = this.stashed = {};

			if ( x instanceof Object && 'origin' in x && 'right' in x && 'bottom' in x ) {
				applyPoints.call(this, x.origin, x.right, x.bottom);
				if ( y ) {
					// if y == true, then we clone its stashed values too
					stash.rect = new BaseRectangle();
					var r = x.stashed.rect;
					applyPoints.call(stash.rect, r.origin, r.right, r.bottom);
					stash.width = x.stashed.width;
					stash.height = x.stashed.height;
					return;
				}

			} else if ( x instanceof Object && 'x' in x && 'y' in x ) {
				applyPoints.call(this, x, y, width);

			} else {
				this.applyDimensions(x, y, width, height);
			}

			this.stash();
		}

		Rectangle.prototype = {

			get width() {
				return distance(this.right, this.origin);
			},

			get height() {
				return distance(this.bottom, this.origin);
			},

			get x() {
				return this.origin.x;
			},

			get y() {
				return this.origin.y;
			},

			get cx() {
				return this.origin.x + this.width/2;
			},

			get cy() {
				return this.origin.y + this.height/2;
			},
			// those methods above are copy-pasted from BaseRectangle prototype, do not change here

			equal: function(r, p) {
				p || (p = 1E-6);
				if ( this == r ) { return true; }
				return abs(this.origin.x-r.origin.x)<=p && abs(this.origin.y-r.origin.y)<=p && abs(this.right.x-r.right.x)<=p &&
						abs(this.right.y-r.right.y)<=p && abs(this.bottom.x-r.bottom.x)<=p && abs(this.bottom.y-r.bottom.y)<=p;

			},

			stash: function() {
				if ( !this.stashed.rect ) {
					this.stashed.rect = new BaseRectangle();
				}
				applyPoints.call(this.stashed.rect, this.origin, this.right, this.bottom);
				this.stashed.width = this.stashed.rect.width;
				this.stashed.height = this.stashed.rect.height;
			},

			applyDimensions: function(x, y, width, height) {
				if ( width == undefined && height == undefined ) {
					width = x;
					height = y;
					x = this.x;
					y = this.y;
				}
				return applyDimensions.call(this, +x||0, +y||0, +width||0, +height||0);
			},

			get matrix() {
				return this.mtrx.set(
					(this.right.x - this.origin.x) / this.stashed.width,
					(this.right.y - this.origin.y) / this.stashed.width,
					(this.bottom.x - this.origin.x) / this.stashed.height,
					(this.bottom.y - this.origin.y) / this.stashed.height,
					this.x,
					this.y
				);
			},

			applyMatrix: function(matrix) {
				var source = this.stashed.rect;
				transformPoint(source.origin, matrix, this.origin);
				transformPoint(source.right, matrix, this.right);
				transformPoint(source.bottom, matrix, this.bottom);
				return this;
			},


			get sx() {
				return scale.call(this, true);
			},

			get sy() {
				return scale.call(this, false);
			},

			get angle() {
				var a = 0;
				var o = this.origin;
				var b = this.bottom;
				var r = this.right;

				if ( r.y - o.y != 0 && r.x - o.x != 0 ) {
					a = atan2( r.y - o.y, r.x - o.x );
				} else if ( b.y - o.y != 0 && b.x - o.x != 0 ) {
					a = atan2( b.y - o.y, b.x - o.x ) - pi/2;
				}
				return a * RAD2DEG;
			},

			get bounds() {
				var ry = this.right.y;
				var oy = this.origin.y;
				if ( oy == ry ) {
					// not rotated
					return applyPoints.call(this, this.origin, this.right, this.bottom);
				}
				var ox = this.origin.x;
				var rx = this.right.x;
				var bx = this.bottom.x;
				var by = this.bottom.y;
				var fx = rx + bx - ox;
				var fy = ry + by - oy;
				var minX = min( ox, rx, bx, fx );
				var maxX = max( ox, rx, bx, fx );
				var minY = min( oy, ry, by, fy );
				var maxY = max( oy, ry, by, fy );
				// boundaries is immutable
				return applyDimensions.call(boundaries, minX, minY, maxX-minX, maxY-minY);
			},

			set width(value) {
				if ( value < 0 ) {
					throw new RangeError('Rectangle\'s width can not be negative');
				}
				var angle = this.angle * DEG2RAD;
				this.right.x = this.origin.x + Math.cos(angle) * value;
				this.right.y = this.origin.y + Math.sin(angle) * value;
			},

			set height(value) {
				if ( value < 0 ) {
					throw new RangeError('Rectangle\'s height can not be negative');
				}
				var angle = this.angle * DEG2RAD;
				this.bottom.x = this.origin.x + Math.sin(angle) * value;
				this.bottom.y = this.origin.y + Math.cos(angle) * value;
			},

			set x(value) {
				var delta = value - this.origin.x;
				this.origin.x += delta;
				this.right.x += delta;
				this.bottom.x += delta;
			},

			set y(value) {
				var delta = value - this.origin.y;
				this.origin.y += delta;
				this.right.y += delta;
				this.bottom.y += delta;
			},

			// on both absTransform & relTransform the most usual case is uniform scaling, therefore sy is the
			// last parameter and if omitted sx is used for sy

			// transform to explicit values given
			absTransform: function(originX, originY, x, y, sx, angle, sy) {
				isNaN(angle) && (angle = this.angle);
				isNaN(sx) && (sx = this.sx);
				isNaN(sy) && (sy = sx);
				isNaN(x) && (x = 0);
				isNaN(y) && (y = 0);
				this.applyMatrix( this.matrix.transform(originX, originY, angle-this.angle, sx/this.sx, sy/this.sy, x, y) );
				return this;
			},

			// apply values given to existing ones
			// NB! scale values are multiplied, not added - so to keep some value as it was pass 0, except for scale pass 1
			relTransform: function(originX, originY, x, y, sx, angle, sy) {
				isNaN(angle) && (angle = 0);
				!(+sx||0) && (sx = 1);
				!(+sy||0) && (sy = sx);
				isNaN(x) && (x = 0);
				isNaN(y) && (y = 0);
				this.applyMatrix( this.matrix.transform(originX, originY, angle, sx, sy, x, y) );
				return this;
			}

		};

		return Rectangle;
	}


	if (typeof define === 'function' && define.amd) {
		define(['./matrix'], create);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = create(require('@atirip/matrix'));
	} else {
		this.atirip ? ( this.atirip.Rectangle = create(this.atirip.Matrix) ) : create();
	}

}).call(this);
