Thread JS - A simple library for JavaScript Thread support 
==================================================

Introduction
--------------------------------------

ThreadJS is a simple approach to execute your JavaScript in different threads. This uses 'Workers' in HTML5 specifications and comes with a 'fallback' mechanism to support unsupported browsers.


Support
--------------------------------------
Currently this library supports the latest versions of Google Chrome and Firefox and deploys the fallback mechanism in other browsers. (More information about the specific version of browsers will be coming soon..)


Example 1
----------

```javascript

	var threadInstance = new Thread();

	var count = 1000000000;
	
	threadInstance.start(count, function (count) {
		var result = 0;
		for (i = 1; i < count; i++) {
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


Example 2
----------

```javascript

	var count = 1000000000;
	
	var threadInstance = new Thread({
		data: count,
		job: function (count) {
			var result = 0;
			for (i = 1; i < count; i++) {
				result = result + i;
			}
			return result;
		},
		finish: function (result) {
			/* Do something here to handle the result */
			/* Use 'this.ReStart(<New Params Object>);' to perform the execution again without closing the Thread*/
			/* If everthing is done 'Close' the thread */
			this.close();
		},
		fail: function (error) {
			/* Do something here to handle the error */
		}
	});
	
	threadInstance.start();
	
```

Note
--------------------------------------
When passing parameter object, it is copied to the thread, instead of passing the reference by default by 'Worker' and by reference for fallback (When 'Worker') support is not there.
More browser support will come in future.

Questions?
----------

If you have any questions, please feel free to send an email to Ashan Fernando (ashan256@gmail.com)
