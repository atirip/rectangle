# Rectangle

General purpose, parallelogram style rectangle library.

## Overview

A way to describe and manipulate any 2D (also rotated) rectangle. 

- Every rectangle can be fully described by only 3 points - which i call here origin (top-left), right (top-right), bottom (bottom-left). Everything else is based and calculated using those points.
- Rectangles have it's initial (here called stashed) dimensions and then can be transformed by applying matrix. You can apply transforms only to initial values. But any transformed state can be stashed (made a new initial state). In other words transforms are just a projections. Note however that all rectangle's properties are always "real", so if rectangle with width of 100 is scaled by factor 2, then the width becomes 200.
- The main purpose (or need why i wrote this) is to build virtual layout library. One can add rectangles onto virtual pasteboard and then translate and scale (also rotate) that inside a viewport. 

## Install

	$ npm install @atirip/rectangle

Or clone this repo.  
It has @atirip/matrix as submodule

## Usage

	import {Rectangle} from './rectangle.js';

## API

### new Rectangle(...)	

Creates new rectangle. Initial values are stashed automatically.  
Parameters can be:

<dl>

<dt>
	x, y, width, height
</dt>
<dd>
	Numbers
</dd>

<dt>
	width, height
</dt>
<dd>
	Numbers, x and y are set to <code>0</code>
</dd>

<dt>
	origin, right, bottom
</dt>
<dd>
	Points <code>{x:, y:}</code>
</dd>

<dt>
	rectangle, toClone
</dt>
<dd>
	Instance of a Rectangle, Boolean. If <code>toClone</code> is true, then exact clone is created - stashed values are copied over, not created from initial values.
</dd>

</dl>

### Properties
<dl>
<dt>
	x, y, width, height
</dt>
<dd>
	Numbers. The obvious ones. Setter and getter.
</dd>

<dt>
	cx, cy
</dt>
<dd>
	Numbers. Center of the rectangle in absolute coordinates - <code>10,10,100,100</code> rectangle's center is <code>45,45</code>. Only getter.
</dd>

<dt>
	matrix
</dt>
<dd>
	Instance of Matrix (<a href="https://github.com/atirip/matrix">https://github.com/atirip/matrix</a>). Only getter.
</dd>

<dt>
	sx, sy, angle
</dt>
<dd>
	Numbers. Scale and angle of currently applied matrix. Only getter.
</dd>

<dt>
	bounds
</dt>
<dd>
	Special instance of Rectangle. Bounding box of a rectangle, immutable, has only getters for <code>x, y, width, height, cx, cy</code>.
</dd>


</dl>

###	 equal(rectangle, precision)

returns Boolean.

<dl>

<dt>
	rectangle
</dt>
<dd>
	Instance of a Rectangle to compare with
</dd>

<dt>
	precision
</dt>
<dd>
	Float. If omitted, 1E-6 is used. Difference less or equal to precision is considered equal.
</dd>

</dl>

Matrix transform results suffer often from rounding and comparing floats is not exact.


### stash()
Save current dimensions as initial ones.

### applyDimension(x, y, width, height)
<dl>
<dt>
	x, y, width, height
</dt>
<dd>
	Numbers. Apply all new dimensions to the Rectangle
</dd>
</dl>

### applyMatrix(matrix) {
<dl>
<dt>
	matrix
</dt>
<dd>
	Instance of Matrix (<a href="https://github.com/atirip/matrix">https://github.com/atirip/matrix</a>). Apply that matrix to rectangle.
</dd>
</dl>

### absTransform(originX, originY, x, y, sx, angle, sy)
Transform to explicit values given.
<dl>
<dt>
	originX, originY, x, y, sx, angle, sy
</dt>
<dd>
	Numbers. Scale, rotate rectangle over specified origin, then translate. The most usual case is uniform scaling, therefore <code>sy</code> is the last parameter and if omitted <code>sx</code> is used for <code>sy</code>.
</dd>
</dl>

### relTransform(originX, originY, x, y, sx, angle, sy)
Apply values passe to existing ones. For example if angle is 45 and 2 is passed, new angle will be 47. Scaling values are multiplied, if sx is 2 and 0.8 is passed, new sx will be 1.6. Otherwise same as <code>absTransform</code>.
##Test

	$ npm test

## License

Copyright &copy; 2015 Priit Pirita, released under the MIT license.

