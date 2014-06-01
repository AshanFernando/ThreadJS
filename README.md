Thread JS - A simple library for JavaScript Thread support 
==================================================

Introduction
--------------------------------------
ThreadJS is JavaScript library to simplify executing your JavaScript code in different threads. Though this library uses 'Workers' internally, interaction model is changed from a message based mechanism to a simple promise based execution pattern. Since the 'Worker' specification is not fully supported by all the major browsers, Thread JS comes with a 'fallback' mechanism to support unsupported browsers which will continue executing your JavaScript code within the 'Main Thread' instead.

Workers
--------------------------------------
The 'Worker' interface spawns real OS-level threads. Since Thread JS uses workers internally, you are actually creating real OS-level threads to execute your JavaScript code. Web workers utilizes carefully controlled communication points with other threads limiting the ability to cause concurrency problems.

Note: There's no access to non-thread safe components or the DOM and you have to pass specific data in and out of a thread through serialized objects (Copied).  Therefore its highly unlikely hard to cause problems in your code while executing in parallel.


Example 1: 
----------
Following code uses a new Thread to compute the summation of numbers from 1 - 1,000,000,000 and returns the results to main Thread.

```javascript

var thread = new Thread();
thread.start(1000000000, function (size) {
    var x = 0;
    for (var i = 1; i <= size; i++) {
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


Example 2: 
----------
Comparing Single-Thread vs Multi-Thread summation of numbers from 1 - 2,000,000,000. 
Note: Multi-Thread approach uses almost half of the time needed for Single-Thread approach.

```javascript
/*Start: Code segment 1 : Note :- This code runs in the Main Thread*/
var s1_start = new Date();
var x = 0;
for (var i = 1; i <= 2000000000; i++) {
    x = x + i;
}
var s1_end = new Date();
console.log('Result 1: ' + x + ' ( ' + (s1_end - s1_start) + '  milliseconds)');

/*End: Code segment 1 */

/*Start: Code segment 2 : Note :- Two Threads are used to compute the value*/
var s2_start = new Date(),
    s2_end;
var y = 0;
var thread1 = new Thread();
thread1.start(null, function () {
    var x = 0;
    for (var i = 1; i <= 1000000000; i++) {
        x = x + i;
    }
    return x;
}).then(function (result) {
    y = y + result;
    s2_end = new Date();
    console.log('Result 2: ' + y + ' ( ' + (s2_end - s2_start) + '  milliseconds)');
    this.close();
});

var thread2 = new Thread();
thread2.start(null, function () {
    var x = 0;
    for (var i = 1000000001; i <= 2000000000; i++) {
        x = x + i;
    }
    return x;
}).then(function (result) {
    y = y + result;
    s2_end = new Date();
    console.log('Result 2: ' + y + ' ( ' + (s2_end - s2_start) + '  milliseconds)');
    this.close();
})

/*End: Code segment 2 */
	
```
See the results in: [JSFiddle](http://jsfiddle.net/ashanfer/K88L3/3/)

Browser Support
--------------------------------------
Thread JS currently supports Google Chrome 4.0 + and Mozilla Firefox 3.5+ and Fallback to Single Thread Support for Other browsers.

Note: Though IE10/11 is in the compatibility list, [Security Bug](https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11) passing Blobs to Workers makes it fallback.


Questions?
----------

If you have any questions, feel free to contact me Email: [ashan256@gmail.com](mailto:ashan256@gmail.com?Subject=ThreadJS%20Support), Linkedin: [Profile Link](http://www.linkedin.com/in/ashan256)
