
import { expect } from 'chai';
import {Matrix} from './matrix/matrix.js';
import {Rectangle} from './rectangle.js';
import lint from 'mocha-eslint';

describe("Rectangle", function() {

	lint(['./rectangle.js']);

	it('should be a function', function () {
		expect(Rectangle).to.be.a('function');
	});

	it('should accept 4 numeric parameters', function () {
		var R = new Rectangle(1,2,3,4);
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(2);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(4);
	});

	it('should accept 2 numeric parameters', function () {
		var R = new Rectangle(3,4);
		expect(R.x).to.be.equal(0);
		expect(R.y).to.be.equal(0);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(4);
	});

	it('should accept 3 points as parameters', function () {
		var R = new Rectangle({x:1, y:1}, {x:5, y:1}, {x:1, y:6});
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(1);
		expect(R.width).to.be.equal(4);
		expect(R.height).to.be.equal(5);
	});

	it('should accept Rectangle as parameter (clone)', function () {
		var R = new Rectangle( new Rectangle(1,2,3,4) );
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(2);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(4);

		var R = new Rectangle( new Rectangle(1,2,3,4), true );
		R.width = 7;
		R.height = 6;
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(2);
		expect(R.width).to.be.equal(7);
		expect(R.height).to.be.equal(6);

		expect(R.stashed.width).to.be.equal(3);
		expect(R.stashed.height).to.be.equal(4);

		expect(R.stashed.rect.x).to.be.equal(1);
		expect(R.stashed.rect.y).to.be.equal(2);
		expect(R.stashed.rect.width).to.be.equal(3);
		expect(R.stashed.rect.height).to.be.equal(4);

	});

	it('should accept Rectangle as parameter (copy)', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.absTransform(150, 150, 0, 0, 2, 45, 2);
		var RR = new Rectangle(R);
		RR.applyMatrix ( R.matrix.inverse() );
		expect( RR.equal( new Rectangle(0, 0, 200, 100) ) ).to.be.ok;
	});

	// all constructor functions actually test x,y,width,height getters

	it('should change width', function () {
		var R = new Rectangle(3,4);
		R.width = 6;
		expect(R.x).to.be.equal(0);
		expect(R.y).to.be.equal(0);
		expect(R.width).to.be.equal(6);
		expect(R.height).to.be.equal(4);
	});

	it('should change height', function () {
		var R = new Rectangle(3,4);
		R.height = 6;
		expect(R.x).to.be.equal(0);
		expect(R.y).to.be.equal(0);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(6);
	});

	it('should change x', function () {
		var R = new Rectangle(3,4);
		R.x = 6;
		expect(R.x).to.be.equal(6);
		expect(R.y).to.be.equal(0);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(4);
	});

	it('should change y', function () {
		var R = new Rectangle(3,4);
		R.y = 6;
		expect(R.x).to.be.equal(0);
		expect(R.y).to.be.equal(6);
		expect(R.width).to.be.equal(3);
		expect(R.height).to.be.equal(4);
	});

	it('should stash values', function () {
		var R = new Rectangle(3,4);
		expect(R.stashed.width).to.be.equal(3);
		expect(R.stashed.height).to.be.equal(4);
		expect(R.stashed.rect.origin).to.be.deep.equal({x:0, y:0});
		expect(R.stashed.rect.right).to.be.deep.equal({x:3, y:0});
		expect(R.stashed.rect.bottom).to.be.deep.equal({x:0, y:4});

		R.width = 6;
		R.height = 7;
		expect(R.stashed.width).to.be.equal(3);
		expect(R.stashed.height).to.be.equal(4);

		R.stash();
		expect(R.stashed.width).to.be.equal(6);
		expect(R.stashed.height).to.be.equal(7);
		expect(R.stashed.rect.origin).to.be.deep.equal({x:0, y:0});
		expect(R.stashed.rect.right).to.be.deep.equal({x:6, y:0});
		expect(R.stashed.rect.bottom).to.be.deep.equal({x:0, y:7});


	});

	it('should apply dimensions', function () {
		var R = new Rectangle(3,4);
		R.applyDimensions(1,2,5,6);
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(2);
		expect(R.width).to.be.equal(5);
		expect(R.height).to.be.equal(6);
		R.applyDimensions(7,8);
		expect(R.x).to.be.equal(1);
		expect(R.y).to.be.equal(2);
		expect(R.width).to.be.equal(7);
		expect(R.height).to.be.equal(8);
	});

	it('should apply matrix', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.applyMatrix({a: 0.707106781186548, b: -0.707106781186548, c: 0.707106781186548, d: 0.707106781186548, e:0, f:0});
		expect(~~R.width).to.be.equal(200);
		expect(~~R.height).to.be.equal(100);
	});

	it('should get matrix', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.applyMatrix({a: 0.707106781186548, b: -0.707106781186548, c: 0.707106781186548, d: 0.707106781186548, e:0, f:0});
		var M = R.matrix;
		expect(M.a.toFixed(2)).to.be.equal('0.71');
		expect(M.b.toFixed(2)).to.be.equal('-0.71');
		expect(M.c.toFixed(2)).to.be.equal('0.71');
		expect(M.d.toFixed(2)).to.be.equal('0.71');
		expect(M.e).to.be.equal(0);
		expect(M.f).to.be.equal(0);
	});

	it('should get bounding rect', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.applyMatrix({a: 0.707106781186548, b: -0.707106781186548, c: 0.707106781186548, d: 0.707106781186548, e:0, f:0});
		var B = R.bounds;
		expect(B.x.toFixed(2)).to.be.equal('0.00');
		expect(B.y.toFixed(2)).to.be.equal('-141.42');
		expect(B.width.toFixed(2)).to.be.equal('212.13');
		expect(B.height.toFixed(2)).to.be.equal('212.13');
	});

	it('should get angle', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.applyMatrix({a: 0.707106781186548, b: -0.707106781186548, c: 0.707106781186548, d: 0.707106781186548, e:0, f:0});
		expect(R.angle.toFixed(2)).to.be.equal('-45.00');
	});

	it('should get sx, sy', function () {
		var R = new Rectangle(0, 0, 200, 100);
		R.applyDimensions(400, 200);
		expect(R.sx).to.be.equal(2);
		expect(R.sy).to.be.equal(2);
	});

	it('should get cx, cy', function () {
		var R = new Rectangle(30, 20, 200, 100);
		expect(R.cx).to.be.equal(130);
		expect(R.cy).to.be.equal(70);
	});

	it('should apply matrix transforms', function () {
		var R = new Rectangle(0, 0, 200, 100);
		var u = undefined;
		R.absTransform(0, 0, 150 - R.cx, 150 - R.cy, 1, 0, 1);
		expect( new Matrix(R.matrix).equal({a:1,b:0,c:0,d:1,e:50,f:100}) ).to.be.ok;

		R.absTransform(150, 150, u, u, u, -45, u);
		expect( new Matrix(R.matrix).equal({a:0.707106,b:-0.707106,c:0.707106,d:0.707106,e:43.933982,f:185.355339}) ).to.be.ok;

		R.absTransform(150, 150, u, u, 2, u, u);
		expect( new Matrix(R.matrix).equal({a:1.414213,b:-1.414213,c:1.414213,d:1.414213,e:-62.132034,f:220.710678}) ).to.be.ok;

		R.relTransform(150, 150, 1, -1, 0.5, 90, u);
		expect( new Matrix(R.matrix).equal({a:0.707106,b:0.707106,c:-0.707106,d:0.707106,e:115.644660,f:42.933982}) ).to.be.ok;
	});


});

