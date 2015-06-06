# Rectangle

General purpose, parallelogram style rectangle library.

## Why?

A way to describe and manipulate any 2D (also rotated) rectangle. Every ractangle can be fully described by only 3 points. 

## Install

	$ npm install @atirip/rectangle

Or clone this repo.  
It depends of @atirip/matrix.

## Usage


#####Standard browser use

	<script src="rectangle.js"></script>
	<script>
		var rect = new atirip.Rectangle();
	</script>


- no minfied version is supplied
- it attaches itself in 'atirip' namespace

#####AMD

	require(["rectangle"], function(Rectangle) {
	  // ...
	});
	
	
#####In nodejs/browserify

	var Rectangle = require("@atirip/rectangle");
	
## API
	
...coming

##Test

	$ npm test

## License

Copyright &copy; 2015 Priit Pirita, released under the MIT license.

