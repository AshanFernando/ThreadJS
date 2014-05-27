Thread JS - A simple library for JavaScript Thread support 
==================================================

Introduction
--------------------------------------

ThreadJS is a simple approach to execute your JavaScript in different threads. This uses 'Workers' in HTML5 specifications and comes with a 'fallback' mechanism to support unsupported browsers.


Support
--------------------------------------
Currently this library supports the latest versions of Google Chrome and Firefox and deploys the fallback mechanism in other browsers.


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
