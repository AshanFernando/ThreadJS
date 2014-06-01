Thread JS - A simple library for JavaScript Thread support 
==================================================

Introduction

--------------------------------------
ThreadJS is JavaScript library to simplify executing your JavaScript code in different threads. Though this library uses 'Workers' internally, interaction model is changed from a message based mechanism to a simple promise based execution pattern. Since the 'Worker' specification is not fully supported by all the major browsers, Thread JS comes with a 'fallback' mechanism to support unsupported browsers which will continue executing your JavaScript code within the 'Main Thread' instead.

Workers
--------------------------------------
The 'Worker' interface spawns real OS-level threads. Since Thread JS uses workers internally, you are actually creating real OS-level threads to execute your JavaScript code. Web workers utilizes carefully controlled communication points with other threads limiting the ability to cause concurrency problems.

Note: There's no access to non-thread safe components or the DOM and you have to pass specific data in and out of a thread through serialized objects (Copied).  Therefore its highly unlikely hard to cause problems in your code while executing in parallel.


Support
--------------------------------------
Currently this library supports the latest versions of Google Chrome and Firefox and deploys the fallback mechanism in other browsers. (More information about the specific version of browsers will be coming soon..)


Example 1: 
----------
Following code uses a new Thread to compute the summation of numbers from 0 - 1000,000,000 and returns the results to main Thread.

```javascript

var thread = new Thread();
thread.start(1000000000, function (size) {
    var x = 0;
    for (var i = 1; i < size; i++) {
        x = x + i;
    }
    return x;
}).then(function (result) {
    console.log('Result: ' + result);
    this.close();
}).fail(function (error) {
    console.log('Error: ' + error);
    this.close();
});
	
```
See the results in: [JSFiddle](http://jsfiddle.net/ashanfer/D2qPV/10/)



Browser Support
--------------------------------------
Thread JS currently supports Google Chrome 4.0 + and Mozilla Firefox 3.5+ and Fallback to Single Thread Support for Other browsers.

Note: Though IE10/11 is in the compatibility list, [Security Bug](https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11) passing Blobs to Workers makes it fallback.


Questions?
----------

If you have any questions, feel free to contact me
[Ashan Fernando](mailto:ashan256@gmail.com?Subject=ThreadJS%20Support)
[Linkedin](http://www.linkedin.com/in/ashan256)
