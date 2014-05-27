Thread JS - A simple library for JavaScript Thread support 
==================================================

Contribution Guides
--------------------------------------

In the spirit of open source software development, Thread JS always encourages community code contribution.

For the moment please check on the demo.html for the usage of Thread JS. More improvements, information and examples will be coming soon !!

Example
----------

```javascript

	var threadInstance = new Thread();
	var param = 1000000000;
	threadInstance.start(param, function (param) {
		var result = 0;
		for (i = 1; i < param; i++) {
			result = result + i;
		}
		return result;
	}).finish(function (result) {
		/* Do something here to handle the result */
		
		/* If everthing is done 'Close' the thread */
		this.close();
	}).fail(function (error) {
		/* Do something here to handle the error */
	});
			
```

Questions?
----------

If you have any questions, please feel free to send an email to Ashan Fernando (ashan256@gmail.com)
