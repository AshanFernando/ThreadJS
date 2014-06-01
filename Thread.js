(function (window, Worker, Blob, URL) {
    'use strict';
    var workerFactory = function (job) {

        var singleThreadWorker = function (jobFunc) {
            /* Single Thread Worker to support fallback in unsupported browsers */
            var worker = function () {
                this.result = null;
                this.error = null;
                this.postMessage = function (data) {
                    try {
                        this.result = jobFunc(data);
                    } catch (e) {
                        this.error = e;
                    }
                };
                this.close = function () {
                    this.result = null;
                    this.error = null;
                };
            }
            return new worker(job);
        };

        var multiThreadWorker = function (jobFunc) {
            /* Multi Thread Worker that uses 'Worker' object */
            var createBlob = function (response) {
                var blob, BlobBuilder;
                try {
                    blob = new Blob([response], { type: 'text/javascript' });
                } catch (e) { /* Backwards-compatibility */
                    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                    blob = new BlobBuilder();
                    blob.append(response);
                    blob = blob.getBlob();
                }

                return blob;
            },
            jobCode = 'onmessage = function (msg) { var job = ' + jobFunc.toString() + '; var result = job(msg.data); this.postMessage(result); };',
            blob = createBlob(jobCode),
            url = URL.createObjectURL(blob),
            workerInstance = new Worker(url);

            workerInstance.url = url;
            workerInstance.close = function () {
                this.terminate();
                if (blob && url) { /* Release the blob URL when closing Worker */
                    URL.revokeObjectURL(url);
                };
            }
            return workerInstance;
        };

        var create = function (parallel) {
            var workerInstance;
            try {
                workerInstance = (parallel === false) || !Worker ? singleThreadWorker(job) : multiThreadWorker(job);
            } catch (e) {     /* If Worker is not supported by the browser or causes issues, fallback to 'Single Thread Worker' mode */
                workerInstance = singleThreadWorker(job);
            }
            return workerInstance;
        }
        return { create: create };
    };

    var Thread = function (opt) {

        var self = this, options = opt || {}, workerInstance, thenPromise, failPromise;

        this.then = function (callback) {
            if (workerInstance.result) { /* Initialize then promise */
                callback.bind(this)(workerInstance.result);
            }
            thenPromise = callback;
            return this;
        };

        this.fail = function (callback) {
            if (workerInstance.error) { /* Initialize fail promise */
                callback.bind(this)(workerInstance.error);
            }
            failPromise = callback;
            return this;
        };

        this.start = function (data, job) {
            /* Initialize worker instance */
            workerInstance = workerFactory(job).create(options.parallel);

            workerInstance.onmessage = function (msg) {
                /* After executing the job, call 'then' promise */
                if (typeof thenPromise === 'function') {
                    thenPromise.bind(self)(msg.data, self.getId());
                }
            };

            workerInstance.onerror = function (msg) {
                /* If error occurs while executing code call 'fail' promise */
                if (typeof failPromise === 'function') {
                    failPromise.bind(self)(msg);
                }
            };

            /* Start worker */
            workerInstance.postMessage(data);
            return this;
        };

        this.close = function () {
            workerInstance.close();
        };

        this.reStart = function (data) {
            /* Re-execute job with new parameters */
            if (workerInstance.result) {
                workerInstance.result = null;
            }
            if (workerInstance.error) {
                workerInstance.error = null;
            }
            workerInstance.postMessage(data);
            return this;
        };

        this.getId = function () {
            /* Return unique identifier of the Thread */
            return workerInstance.url.split('/')[1];
        };
    };

    if (!window.Thread) {
        /* Initialize global Thread object */
        window.Thread = Thread;
    }

    return Thread;

}(window, window.Worker, Blob, window.URL || window.webkitURL));